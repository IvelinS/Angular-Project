const router = require('express').Router();
const users = require('./users');
const recipes = require('./recipes');
const { authController } = require('../controllers');
const express = require('express');

// Add explicit content type handling for login
router.post('/login', express.json(), (req, res, next) => {
    console.log('Login request body:', req.body); // Debug log
    authController.login(req, res, next);
});

router.post('/register', authController.register);
router.post('/logout', authController.logout);

router.use('/users', users);
router.use('/recipes', recipes);

module.exports = router;