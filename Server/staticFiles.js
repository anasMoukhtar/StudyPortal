const express = require('express');
const path = require('path');

module.exports = (app) => {
    app.use(express.static(path.join(__dirname, '../HomePage')));
    app.use(express.static(path.join(__dirname, '../')));
    app.use(express.static(path.join(__dirname, '../Sign-up')));
    app.use(express.static(path.join(__dirname, '../Sign-In')));
    app.use(express.static(path.join(__dirname, '../Plans')));
    app.use(express.static(path.join(__dirname, '../commonFiles')));
    app.use(express.static(path.join(__dirname, '../about')));
    app.use(express.static(path.join(__dirname, '../Contact')));
};
