
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"]
    }
});


const connectedClients = {};

io.on('connect', (socket) => {
    console.log('Client connected: ', socket.id);

    // Store client's socket ID in connectedClients object
    connectedClients[socket.id] = socket;

    // Handle signaling messages
    socket.on('offer', (data) => {
        // Broadcast the offer message to the specified recipient
        const { recipientId, offer } = data;
        if (connectedClients[recipientId]) {
            connectedClients[recipientId].emit('offer', { senderId: socket.id, offer });
        } else {
            console.log(`Recipient ${recipientId} is not connected.`);
        }
    });

    socket.on('answer', (data) => {
        // Broadcast the answer message to the specified recipient
        const { recipientId, answer } = data;
        if (connectedClients[recipientId]) {
            connectedClients[recipientId].emit('answer', { senderId: socket.id, answer });
        } else {
            console.log(`Recipient ${recipientId} is not connected.`);
        }
    });

    socket.on('ice-candidate', (data) => {
        // Send ICE candidate to the specified recipient
        const { recipientId, candidate } = data;
        if (connectedClients[recipientId]) {
            connectedClients[recipientId].emit('ice-candidate', { senderId: socket.id, candidate });
        } else {
            console.log(`Recipient ${recipientId} is not connected.`);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected: ', socket.id);
        delete connectedClients[socket.id];
    });
});

// Define a route handler for the root URL ("/")
app.get('/', (req, res) => {
    res.send('Signaling Server is up and running!');
});


http.listen(3000, () => {
    console.log('Signaling server running at http://localhost:3000');
});












