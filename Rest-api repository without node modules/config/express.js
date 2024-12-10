const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cookieSecret = process.env.COOKIESECRET || 'SoftUni';


module.exports = (app) => {
    // Configure CORS before other middleware
    app.use(cors({
        origin: 'http://localhost:4200',
        credentials: true, 
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(cookieParser(cookieSecret));

    app.use(express.static(path.resolve(__basedir, 'static')));

    // app.use(errorHandler(err, req, res, next));
};
