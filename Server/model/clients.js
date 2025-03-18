const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index:true,
    },
    password: {
        type: String,
        required: true,
    },
    pfp:{
        type: String,
        default: 'pfp.png'
    }
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
