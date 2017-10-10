'use strict';

const db = require('../configs/mongo');
const mongo = db.getConnection('products');

/**
 * Schena de livros
 */
const productsSchema = mongo.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: String },
    tags: { type: Array, default: [] },
    updated_at: { type: Date, default: Date.now },
});

const model = mongo.model('Products', productsSchema);

module.exports = model;