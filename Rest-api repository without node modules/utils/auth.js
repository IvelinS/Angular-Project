const jwt = require('./jwt');
const { authCookieName } = require('../app-config');
const {
    userModel,
    tokenBlacklistModel
} = require('../models');

function auth(redirectUnauthenticated = true) {
    return function (req, res, next) {
        const token = req.cookies[authCookieName] || '';
        
        if (!token) {
            console.log('No token found');
            return res.status(401).json({ message: "No authentication token found" });
        }

        Promise.all([
            jwt.verifyToken(token),
            tokenBlacklistModel.findOne({ token })
        ])
            .then(([decodedToken, blacklistedToken]) => {
                if (blacklistedToken) {
                    return Promise.reject(new Error('blacklisted token'));
                }
                
                console.log('Decoded token:', decodedToken);
                
                return userModel.findById(decodedToken.id)
                    .then(user => {
                        if (!user) {
                            console.log('User not found for id:', decodedToken.id);
                            return Promise.reject(new Error(`User not found for id: ${decodedToken.id}`));
                        }
                        req.user = user;
                        req.isLogged = true;
                        next();
                    });
            })
            .catch(err => {
                console.error('Auth error details:', {
                    message: err.message,
                    token: token.substring(0, 10) + '...',
                    stack: err.stack
                });
                res.status(401).json({ 
                    message: "Authentication failed", 
                    error: err.message 
                });
            });
    }
}

module.exports = auth;
