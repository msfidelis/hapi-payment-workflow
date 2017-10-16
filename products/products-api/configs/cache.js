'use strict';

const redis = require('redis');
const Promise = require('bluebird');

let port = process.env.REDIS_PORT || 6379;
let host = process.env.REDIS_HOST || 'products-redis';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(port, host);

client.on('connect', function() {
    console.log('REDIS: OK!');
});

module.exports = client;