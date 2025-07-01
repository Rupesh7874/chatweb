const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
  groupname: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId, // better than string for referencing
    ref: 'User',
    required: true
  },
  members: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
      }
    }
  ],
  joinRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, { timestamps: true }); 

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
