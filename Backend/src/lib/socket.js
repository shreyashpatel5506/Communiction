import { Server } from 'socket.io';
import http from 'http';
import express from 'express';


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Allow all origins for development; restrict in production

    }
});
// used to store online users
const userSocketMap = new Map(); // Map to store online users by socket ID


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const userId = socket.handshake.query.userId; // Assuming userId is sent as a query parameter
    if (userId) {
        userSocketMap[userId] = socket.id; // Store the userId and socket ID in the map

        // Emit an event to notify that the user is online
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit the list of online users
        console.log('User connected:', userId, 'Socket ID:', socket.id);
    }
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete userSocketMap[userId]; // Remove userId from map on disconnect
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); // Emit the updated list of online users
    })
});

export { io, app, server };
