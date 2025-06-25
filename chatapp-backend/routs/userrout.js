const express = require('express');
const routs = express.Router();
const { userragister, userlogin, allusers, creategroup, request_join, approve_request, getallgroupmember, conversation } = require('../controllers/usercontroller');
const verifyToken = require('../confige/auth');
const user = require('../models/usermodel');


routs.post('/userragister', user.userminimage, userragister);
// routs.post('/userragister', userragister);
routs.post('/userlogin', userlogin);
routs.post('/creategroup', verifyToken, creategroup);
routs.post('/request_join', verifyToken, request_join);
routs.post('/approve_request', verifyToken, approve_request);
routs.get('/getallgroupmember/:id', getallgroupmember);
routs.get('/allusers', verifyToken, allusers);
routs.get('/conversation', verifyToken, conversation);


module.exports = routs
// {
//   "groupid": "665b29b2d5f9c3a3ef0c4e99",
//   "userid": "665a81ac88e0198f1a659541"
// }

// {
//   "senderId": "123",
//   "receiverId": "456",
//   "content": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQC...",
//   "isGroup": false
// }
