const http = require('http');
const express = require('express');
const morgan = require('morgan');
const config = require('../config/config.js');
const router = require('./router.js');

let httpServer;

function initialize() {
    return new Promise((resolve, reject) => {
        const app = express();
        httpServer = http.createServer(app);

        // Combines logging info from request and response
        app.use(morgan('combined'));

        // Mount the router at /api so all its routes start with /api
        app.use('/api', router);

        // express doesn't consider not found 404 as an error so we need to handle 404 it explicitly
        // handle 404 error
        app.use((req, res, next) => {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.use((err, req, res, next) => {
            console.error(err);
            if (err.status === 404)
                res.status(404).json({ message: "Not found" });
            else
                res.status(500).json({ message: "Internal Server Error." });
        })


        httpServer.listen(config.port)
            .on('listening', () => {
                console.log(`Web server listening on localhost:${config.port}`);
                resolve();
            })
            .on('error', err => {
                reject(err);
            });
    });
}

module.exports.initialize = initialize;

function close() {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

module.exports.close = close;