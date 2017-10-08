'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({ port: process.env.PORT || 8000 });

server.register({
    register: require('hapi-router'),
    options: {
        routes: './routes/*.js'
    }
}, (err) => {
    if (err) throw err;
});

server.start((err) => {
    if (err) {
        throw err;
    } else {
        console.log("Products Service Online!");
    }
});

module.exports = server;