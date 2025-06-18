const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const userimg = 'uploads'


const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: String,
        // required: true
    },
     roles: {
     type: String,
     enum: ['admin', 'user'],
     default: 'user'
    },
    gender: {
        type: String,
        // required: true
    },
    isActive: {
        type: String
    },
    profileimage: {
        type: String
    },
    createdAt: Date
}, { timestamps: true });


const userstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'))
    },
    filename: function (req, file, cb) { 
        cb(null, file.fieldname + '-' + Date.now())
    }
})

userschema.statics.userminimage = multer({ storage: userstorage }).single('profileimage');
userschema.statics.useruploadpth = userimg

const User = mongoose.model('user', userschema);

module.exports = User;

// const groupid = 12345;
//   socket.on('group', () => {
//             if (socket.groupid == groupid) {
//                 console.log(`invalid persone`);
//             }
//             socket.join(socket.userId);
//             console.log(`✅ User ${socket.userId} successfully join group`);

//         })