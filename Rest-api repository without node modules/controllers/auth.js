const {
    userModel,
    tokenBlacklistModel
} = require('../models');

const utils = require('../utils');
const { authCookieName } = require('../app-config');

const bsonToJson = (data) => { return JSON.parse(JSON.stringify(data)) };
const removePassword = (data) => {
    const { password, __v, ...userData } = data;
    return userData
}

function register(req, res, next) {
    const { tel, email, username, password, repeatPassword } = req.body;

    return userModel.create({ tel, email, username, password })
        .then((createdUser) => {
            createdUser = bsonToJson(createdUser);
            createdUser = removePassword(createdUser);

            const token = utils.jwt.createToken({ id: createdUser._id });
            if (process.env.NODE_ENV === 'production') {
                res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
            } else {
                res.cookie(authCookieName, token, { httpOnly: true })
            }
            res.status(200)
                .send(createdUser);
        })
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                let field = err.message.split("index: ")[1];
                field = field.split(" dup key")[0];
                field = field.substring(0, field.lastIndexOf("_"));

                res.status(409)
                    .send({ message: `This ${field} is already registered!` });
                return;
            }
            next(err);
        });
}

function login(req, res, next) {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    userModel.findOne({ email })
        .then(user => {
            console.log('User found:', user ? 'yes' : 'no');
            
            if (!user) {
                res.status(401).json({ message: 'Invalid email or password' });
                return Promise.reject(false);
            }

            return Promise.all([user, user.matchPassword(password)]);
        })
        .then(([user, match]) => {
            console.log('Password match:', match ? 'yes' : 'no');

            if (!match) {
                res.status(401).json({ message: 'Invalid email or password' });
                return Promise.reject(false);
            }

            const token = utils.jwt.createToken({ id: user._id });
            console.log('Token created:', token.substring(0, 10) + '...');

            // Set cookie options
            const cookieOptions = {
                httpOnly: true,
                secure: false, // Set to true in production
                sameSite: 'lax',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            };

            res.cookie(authCookieName, token, cookieOptions);
            console.log('Cookie set with token');
            
            const userData = bsonToJson(user);
            const userWithoutPassword = removePassword(userData);
            
            res.status(200).json(userWithoutPassword);
        })
        .catch(err => {
            if (err === false) { return; }
            console.error('Login error:', err);
            next(err);
        });
}

function logout(req, res) {
    const token = req.cookies[authCookieName];

    tokenBlacklistModel.create({ token })
        .then(() => {
            res.clearCookie(authCookieName)
                .status(204)
                .send({ message: 'Logged out!' });
        })
        .catch(err => res.send(err));
}

function getProfileInfo(req, res, next) {
    const { _id: userId } = req.user;

    userModel.findOne({ _id: userId }, { password: 0, __v: 0 }) //finding by Id and returning without password and __v
        .then(user => { res.status(200).json(user) })
        .catch(next);
}

function editProfileInfo(req, res, next) {
    const { _id: userId } = req.user;
    const { tel, username, email } = req.body;

    userModel.findOneAndUpdate({ _id: userId }, { tel, username, email }, { runValidators: true, new: true })
        .then(x => { res.status(200).json(x) })
        .catch(next);
}

module.exports = {
    login,
    register,
    logout,
    getProfileInfo,
    editProfileInfo,
}
