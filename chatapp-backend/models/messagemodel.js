const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const userimg = 'uploads'

const messageschema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    content: {
        type: String,
        // required: true
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'seen'],
        default: 'sent',
    },
    fileUrl: { type: String },
    timestamp: { type: Date, default: Date.now }
})


const message = mongoose.model('message', messageschema);

module.exports = message;