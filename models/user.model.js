const mongoose = require('mongoose');

const User = mongoose.model(
    'User',
    new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        age: Number,
        mobileno: String,
        pan: String,
        hobbies: String,
        gender: String,
        role: String
    })
);

module.exports = User;