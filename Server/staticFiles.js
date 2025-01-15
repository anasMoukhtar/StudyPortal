const express = require('express');
const path = require('path');

module.exports = [
    (app) => app.use(express.static(path.join(__dirname, '../'))),
    (app) => app.use(express.static(path.join(__dirname, '../Sign-up'))),
    (app) => app.use(express.static(path.join(__dirname, '../Sign-In'))),
    (app) => app.use(express.static(path.join(__dirname, '../Plans/'))),
    (app)=> app.use(express.static(path.join(__dirname, '../commonFiles'))),
    (app)=> app.use(express.static(path.join(__dirname, '../about')))

];
