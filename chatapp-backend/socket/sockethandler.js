const jwt = require("jsonwebtoken");
const message = require('../models/messagemodel');
require('dotenv').config();

module.exports = function (io) {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));
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
    socket.on('join', () => {
      socket.join(socket.userId);
    });

    socket.on('joinGroup', (groupId) => {
      socket.join(groupId);
      console.log(`User ${socket.userId} joined group ${groupId}`);
    });

    // ✅ Send Message
    socket.on('message', async ({ senderId, receiverId, content, isGroup, fileUrl }) => {
      try {
        const newMsg = await message.create({
          sender: senderId,
          receiver: receiverId,
          content,
          isGroup: isGroup || false,
          fileUrl,
          status: 'sent',
        });

        const plainMsg = newMsg.toObject();
        if (isGroup) {
          io.to(receiverId).emit('receiveMessage', plainMsg);
        } else {
          io.to(senderId).emit('receiveMessage', plainMsg);
          io.to(receiverId).emit('receiveMessage', plainMsg);
        }

      } catch (err) {
        console.error("❌ Error saving message:", err);
        socket.emit('error', { message: 'Message failed to send' });
      }
    });

    // ✅ Typing
    socket.on("typing", ({ to, typing, isGroup }) => {
      if (isGroup) {
        socket.to(to).emit("typing", {
          from: socket.userId,
          typing,
          isGroup: true,
          to,
        });
      } else {
        socket.to(to).emit("typing", {
          from: socket.userId,
          typing,
          isGroup: false,
        });
      }
    });


    // ✅ Delivered Status
    socket.on('messageDelivered', async ({ messageId, receiverId }) => {
      try {
        const msg = await message.findById(messageId);

        if (msg && msg.receiver.toString() === receiverId && msg.status === 'sent') {
          await message.findByIdAndUpdate(messageId, { status: "delivered" });

          const senderId = msg.sender.toString();
          io.to(senderId).emit("messageDeliveredConfirmation", {
            messageId,
            deliveredBy: receiverId,
          });
        }
      } catch (err) {
        console.error("❌ Error updating message to delivered:", err);
      }
    });

    // ✅ Seen Status
    socket.on('messageSeen', async ({ messageId, receiverId }) => {
      try {
        const msg = await message.findById(messageId);

        if (msg && msg.status !== "seen") {
          await message.findByIdAndUpdate(messageId, { status: "seen" });

          const senderId = msg.sender.toString();
          io.to(senderId).emit("messageSeenConfirmation", {
            messageId,
            seenBy: receiverId,
          });
        }

      } catch (err) {
        console.error("❌ Error updating message to seen:", err.message);
      }
    });



    socket.on('disconnecting', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};
