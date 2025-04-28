const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let users = {};
let messages = [];

const sendUserList = () => {
  const userList = Object.values(users);
  io.emit('userListUpdated', userList);
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (username) => {
    users[socket.id] = username;
    console.log(`${username} joined`);

    socket.emit('chatHistory', messages);
    sendUserList(); 
  });

  socket.on('sendMessage', (message) => {
    console.log('Received message:', message);

    const msgData = {
      user: users[socket.id],
      message,
      timestamp: new Date().toISOString()
    };

    messages.push(msgData);

    io.emit('receiveMessage', msgData);
    console.log('Emitted receiveMessage to all clients');
  });

  socket.on('typing', () => {
    socket.broadcast.emit('userTyping', { name: users[socket.id] });
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('userStopTyping', { name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete users[socket.id];
    sendUserList();  // 👈 After disconnect, update user list again
  });
});

server.listen(5000, () => console.log('Server running on port 5000'));
