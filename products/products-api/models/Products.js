'use strict';

const db = require('../configs/mongo');

const PRODUCT_COLLECTION = process.env.PRODUCT_COLLECTION || 'products';

const mongo = db.getConnection(PRODUCT_COLLECTION);

const pagination = require('mongoose-paginate');

const productsSchema = mongo.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number },
    tags: { type: Array, default: [] },
    updated_at: { type: Date, default: Date.now },
});

productsSchema.plugin(pagination);

const model = mongo.model('Products', productsSchema);

module.exports = model;