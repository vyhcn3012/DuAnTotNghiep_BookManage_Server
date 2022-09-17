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

server.listen(PORT).on('error', (err) => {
    console.log('✘ Application failed to start');
    console.error('✘', err.message);
    process.exit(0);
}).on('listening', () => {
    console.log('✔ Application Started');
});

module.exports = { server };
