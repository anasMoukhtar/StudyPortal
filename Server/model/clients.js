const { default: mongoose } = require('mongoose');

const express = require('express');
const Schema = mongoose.Schema;
const clientSchema = new Schema({
    name: String,
    email: String,
    password: String,})



clientModel = mongoose.model('Client', clientSchema)
module.exports = clientModel