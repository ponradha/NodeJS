const mongoose = require('mongoose');

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        age: Number,
        mobileno: {type: String, required: true},
        pan: {type: String, required: true},
        hobbies: String,
        gender: String,
        role: String,
        createdDate: {type: Date, required: true},
    })
);

module.exports = User;