import { Server } from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);

const userSocketMap = new Map(); // Map to store online users by socket ID

export function getReciverSocketId(userId) {
    return userSocketMap.get(userId); // Use Map's get method
}

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap.set(userId, socket.id); // Use Map's set method

        // Emit an event to notify that the user is online
        io.emit("getOnlineUsers", Array.from(userSocketMap.keys())); // Emit the list of online users
        console.log('User connected:', userId, 'Socket ID:', socket.id);
    }
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (userId) {
            userSocketMap.delete(userId); // Use Map's delete method
            io.emit("getOnlineUsers", Array.from(userSocketMap.keys())); // Emit the updated list of online users
        }
    });
});

export { io, app, server };
