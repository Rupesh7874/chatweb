const jwt = require("jsonwebtoken");
const message = require('../models/messagemodel');
const code = require('../utils/statuscodemessage');
const messagemodel = require('../models/messagemodel')

require('dotenv').config();

module.exports = function (io) {
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("No token provided"));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.userId;

            next();
        } catch (err) {
            console.error("Invalid token", err.message);
            return next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {

        console.log(`Client connected : userId: ${socket.userId}`);

        socket.on('join', () => {
            socket.join(socket.userId);
            console.log(`User ${socket.userId} successfully joined personal room`);
        });

        socket.on('joinGroup', (groupId) => {
            socket.join(groupId);
            console.log(`User ${socket.userId} joined group ${groupId}`);
        });


        socket.on('message', async ({ senderId, receiverId, content, isGroup, fileUrl }) => {
            try {
                // console.log(senderId, receiverId, content, isGroup, fileUrl );
                
                const newMsg = await message.create({
                    sender: senderId,
                    receiver: receiverId,
                    content,
                    isGroup: isGroup || false,
                    fileUrl
                });

                if (isGroup) {
                    io.to(receiverId).emit('receiveMessage', newMsg);
                } else {
                    io.to(receiverId).emit('receiveMessage', newMsg);
                }
                io.to(receiverId).emit('receiveMessage', newMsg);
            } catch (err) {
                console.error("Error saving message:", err);
                socket.emit('error', { message: 'Message failed to send' });
            }
        });

        socket.on('disconnecting', () => {
            console.log(`User disconnected: ${socket.userId}`);
        });
    });
};
