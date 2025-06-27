const mongoose = require('mongoose');

const otpschema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        // required: true
    },
    expire: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("otp", otpschema);