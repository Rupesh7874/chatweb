// src/utils/socket.js
import { io } from 'socket.io-client';

const URL = 'http://localhost:8888'; // Backend server with Socket.IO
export const socket = io(URL, {
  autoConnect: false,
});
