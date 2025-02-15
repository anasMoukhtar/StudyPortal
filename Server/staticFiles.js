const express = require('express');
const path = require('path');

module.exports = (app) => {
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.static(path.join(__dirname, '../public/DashBoard/')));
    app.use(express.static(path.join(__dirname, '../')));
    app.use(express.static(path.join(__dirname, '../public/HomePage')));
    app.use(express.static(path.join(__dirname, '../public/Sign-up')));
    app.use(express.static(path.join(__dirname, '../public/Sign-In')));
    app.use(express.static(path.join(__dirname, '../public/Plans')));
    app.use(express.static(path.join(__dirname, '../public/commonFiles')));
    app.use(express.static(path.join(__dirname, '../public/about')));
    app.use(express.static(path.join(__dirname, '../public/Contact')));
};
