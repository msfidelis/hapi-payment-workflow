'use strict';

module.exports = {

    getConnection: (collectionName) => {

        let mongo = require('mongoose');
        mongo.Promise = require('bluebird');

        let mongo_hostname = process.env.MONGO_HOST || 'products-mongodb';
        let mongo_port = process.env.MONGO_PORT || '27017';
        let mongo_collection = collectionName;

        let mongoaddr = 'mongodb://' + mongo_hostname + ':' + mongo_port + '/' + mongo_collection;
        mongo.connect(mongoaddr, { useMongoClient: true });

        return mongo;

    }
    
}