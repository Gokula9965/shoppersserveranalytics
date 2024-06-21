const mongoose = require("mongoose");


const analyticsUser = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
});
module.exports = mongoose.model("analyticsUser", analyticsUser);