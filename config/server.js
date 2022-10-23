const express = require('express');
// const bodyParser = require( 'body-parser' );
const logger = require('morgan');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'),
    server = express();
const { setRoutes } = require('./routes');
const utility = require('../system/helpers/Utility')

server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.set('views', path.join(__dirname, '../src/views'));
server.set('view engine', 'hbs');
server.use(cookieParser());
server.use(express.static(path.join(__dirname, '../public')));

hbs.registerHelper('checkRole', utility.checkRole);


const cors = require('cors'),
    // Allow Origins according to your need.
    corsOptions = {
        'origin': '*'
    };

server.use(cors(corsOptions));

// server.use( bodyParser.json() );

// Setting up Routes
setRoutes(server);

process.on('uncaughtException', function (exception) {
    // handle or ignore error
    console.log(exception);
});

module.exports = { server };
