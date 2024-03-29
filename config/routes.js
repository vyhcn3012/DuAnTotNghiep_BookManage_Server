'use strict';
const express = require('express');
const path = require('path');
const { HttpError } = require('../system/helpers/HttpError');
const apiRoutes = require('../system/routes');
const cpanelRoutes = require('../system/routes/cpanel.js');

module.exports.setRoutes = (app) => {
    app.get('/', (req, res) => {
        res.redirect('/cpanel/home');
    });

    app.use('/cpanel', cpanelRoutes);

    app.use('/api', apiRoutes);
};
