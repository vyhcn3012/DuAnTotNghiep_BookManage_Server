const express = require( 'express')
const path = require( 'path')

module.exports.setRoutes = (app) => {

    app.get('/', (req, res) => {
        res.send('Welcome to the App')
    })
}
