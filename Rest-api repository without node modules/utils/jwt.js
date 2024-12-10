const jwt = require('jsonwebtoken');
const secret = process.env.SECRET || 'SoftSecret';

function createToken(data) {
    console.log('Creating token for:', data);
    return jwt.sign(data, secret, { expiresIn: '1d' });
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                console.error('Token verification failed:', err.message);
                reject(err);
                return;
            }
            console.log('Token verified:', data);
            resolve(data);
        });
    });
}

module.exports = {
    createToken,
    verifyToken
}