require('dotenv').config();
// Initialize DB Connection
require('./config/database');
// attention, reload cache each restart, every midnight
// require('./config/cache').start();

const config = require('./config/config').getConfig(),
    PORT = config.PORT;
// const { socket } = require('./config/socket');
const http = require('http');
console.log('✔ Bootstrapping Application');
console.log(`✔ Mode: ${config.MODE}`);
console.log(`✔ Port: ${PORT}`);

const { server: app } = require('./config/server');
const server = http.createServer(app);
const socket = require('socket.io');

server
    .listen(PORT)
    .on('error', (err) => {
        console.log('✘ Application failed to start');
        console.error('✘', err.message);
        process.exit(0);
    })
    .on('listening', () => {
        console.log('✔ Application Started');
    });

const io = socket(server, {
    cors: {
        origin: '*',
        credentials: true,
    },
});

global.onlineUsers = new Map();
io.on('connection', (socket) => {
    console.log('New client connected',socket.id);
    global.chatSocket = socket;
    socket.on('add-user', (idRoom) => {
        socket.join(idRoom);
        console.log(`User with ID: ${socket.id} joined room: ${idRoom}`);
        onlineUsers.set(idRoom, socket.id);
    });

    socket.on('send-msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        socket.to(data.to).emit('msg-recieve', { msg: data.msg, name: data.name, image: "data:image/png;base64,"+ data.file, avatar: data.avatar });
    });
});

module.exports = { server };
