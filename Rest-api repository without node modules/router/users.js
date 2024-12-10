const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { auth } = require('../utils');
const { authCookieName } = require('../app-config');
const jwt = require('../utils/jwt');

router.get('/profile', auth(), authController.getProfileInfo);
router.put('/profile', auth(), authController.editProfileInfo);

router.get('/debug-token', (req, res) => {
    const token = req.cookies[authCookieName];
    if (!token) {
        res.json({ message: 'No token found' });
        return;
    }
    
    try {
        const decoded = jwt.verify(token, process.env.SECRET || 'SoftSecret');
        res.json({ 
            token: token.substring(0, 10) + '...',
            decoded 
        });
    } catch (err) {
        res.status(401).json({ 
            message: 'Invalid token',
            error: err.message 
        });
    }
});

module.exports = router;