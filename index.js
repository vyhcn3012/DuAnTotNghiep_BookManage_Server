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
    console.log('New client connected');
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
        socket.join(userId);
        console.log("idRoom",userId);
        onlineUsers.set(userId, socket.id);
    });
   

    socket.on('send-msg', (data) => {
        console.log("data",data);
        const sendUserSocket = onlineUsers.get(data.to);
        socket.to(data.to).emit('msg-recieve', data.msg);
        console.log(">>>> data.msg" + data.msg);
        if (sendUserSocket) {
            
        }
    });
});

module.exports = { server };
