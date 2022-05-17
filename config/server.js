const express = require('express')
const logger = require('morgan')
const path = require('path')
const hbs = require('hbs')
const helmet = require('helmet'),
    server = express()

const {setRoutes} = require('./routes')

server.use(logger('dev'))
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.set('view engine', 'hbs')

const cors = require('cors'),
    // Allow Origins according to your need.
    corsOptions = {     
        'origin': '*'
}                                                                                                                                                            
server.use(cors(corsOptions))

setRoutes(server)

process.on('uncaughtException', function (exception) {
    // handle or ignore error
    console.log(exception)
})

module.exports = { server } 
