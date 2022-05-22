'use strict';
const express = require( 'express')
const path = require( 'path')
const { HttpError } = require( '../system/helpers/HttpError' );
const apiRoutes = require( '../system/routes' );

module.exports.setRoutes = (app) => {

    app.get('/', (req, res) => {
        res.send('Welcome to the App')
    })

    app.use( '/api', apiRoutes );
};
