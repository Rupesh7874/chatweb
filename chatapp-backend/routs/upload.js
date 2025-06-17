const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router(); 

const messagestorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({ storage: messagestorage });

router.post('/upload', upload.single('usermassage'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileUrl = `uploads/${req.file.filename}`;
    res.json({ fileUrl });
});

module.exports = router;
