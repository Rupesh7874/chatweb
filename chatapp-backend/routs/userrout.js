const express = require('express');
const routs = express.Router();
const { userragister, userlogin, allusers, creategroup, request_join, approve_request, getallgroupmember,
       conversation, userupdate, userdelete, getContacts, forgatepassword, resetpassword, deletemessage, makeAdmin, getAdminGroupsWithRequestCounts, updatemessage } = require('../controllers/usercontroller');
const { getUserGroups, deletegroup } = require('../controllers/groupcontroller')
const verifyToken = require('../confige/auth');
const user = require('../models/usermodel');

//user rout-start
routs.post('/userragister', user.userminimage, userragister);
routs.post('/userlogin', userlogin);
routs.put('/userupdate/:id', user.userminimage, userupdate);
routs.delete('/userdelete', userdelete);
routs.get('/allusers', verifyToken, allusers);
routs.post('/forgatepassword', forgatepassword);
routs.post('/resetpassword', resetpassword);

// group-rout
routs.post('/creategroup', verifyToken, creategroup);
routs.post('/request_join', verifyToken, request_join);
routs.post('/approve_request', verifyToken, approve_request);
routs.get('/getallgroupmember/:id', getallgroupmember);
routs.delete('/deletegroup/:groupId', verifyToken, deletegroup)

routs.get('/conversation', verifyToken, conversation);
routs.get('/contacts', verifyToken, getContacts);

routs.delete('/deletemessage', deletemessage);
routs.patch('/updatemessage/:messageId', verifyToken, updatemessage);
routs.post('/makeAdmin ', makeAdmin);
routs.get('/getUserGroups/:userid', verifyToken, getUserGroups)
routs.get('/getAdminGroupsWithRequestCounts', getAdminGroupsWithRequestCounts);

module.exports = routs


// if user socket client tool----------

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
