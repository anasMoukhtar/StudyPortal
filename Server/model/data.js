const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, default: 'incomplete' },
    dueDate: { type: Date }
});

const listSchema = new Schema({
    userEmail: { type: String, required: true },
    title: { type: String, required: true }, 
    tasks: [taskSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('List', listSchema);
