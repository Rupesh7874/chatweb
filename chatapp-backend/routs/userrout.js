const express = require('express');
const routs = express.Router();
const { userragister, userlogin, viewalluser, creategroup, request_join, approve_request , getallgroupmember} = require('../controllers/usercontroller');
const verifyToken = require('../confige/auth');
const user = require('../models/usermodel');


routs.post('/userragister', user.userminimage, userragister);
routs.post('/userlogin', userlogin);
routs.post('/creategroup', verifyToken, creategroup);
routs.post('/request_join', verifyToken, request_join);
routs.post('/approve_request', verifyToken, approve_request);
routs.get('/getallgroupmember/:id', getallgroupmember); 
// routs.get('/viewalluser',verifyToken, viewalluser);


module.exports = routs