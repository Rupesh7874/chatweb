const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const conectdb = require('./confige/db');
const http = require('http')
const cors = require('cors');
const { Server } = require('socket.io');
const socketHandler = require('./socket/sockethandler');
const messageModel = require('./models/messagemodel');

dotenv.config();
conectdb();
// require('./utils/cronJobs');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const server = http.createServer(app);

app.use(cors({
  origin: "http://localhost:3000", // ✅ your React frontend
  methods: ["GET", "POST"],
  credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // ✅ frontend origin
        methods: ["GET", "POST"]
    }
});

socketHandler(io);




const api1router = require('./routs/indexrout')
app.use('/api/v1', api1router);

const uploadRoute = require('./routs/upload');
app.use('/api/v1/upload', uploadRoute);

const groupRoutes = require('./routs/grouproute');
app.use('/api/v1/group', groupRoutes); 


// app.use('/api', uploadRoute);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log("server running sucessfully on port", PORT);
})