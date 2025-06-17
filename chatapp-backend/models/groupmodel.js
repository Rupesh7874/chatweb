const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupname: String,
    createdBy: String,
    members: [
        {
            userId: String,
            role: {
                type: String,
                enum: ['admin', 'member'],
                default: 'member'
            }
        }
    ],
    joinRequests: [String]
});


const group = mongoose.model('group', groupSchema);

module.exports = group;