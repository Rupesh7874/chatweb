const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const conectdb = require('./confige/db');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const socketHandler = require('./socket/sockethandler');
const messageModel = require('./models/messagemodel');

dotenv.config();
conectdb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = http.createServer(app);

// ✅ Setup socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
socketHandler(io);

// ✅ Make `io` accessible in all routes/controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});


const api1router = require('./routs/indexrout');
app.use('/api/v1', api1router);

const uploadRoute = require('./routs/upload');
app.use('/api/v1/upload', uploadRoute);

const groupRoutes = require('./routs/grouproute');
app.use('/api/v1/group', groupRoutes);


const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log("server running successfully on port", PORT);
});
