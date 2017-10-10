'use strict';

const ProductSchema = require('../models/Products');

module.exports = [{
    method: "PUT",
    path: "/products/{id}",
    handler: (req, res) => {
        ProductSchema.findByIdAndUpdate(req.params.id, { $set: req.payload })
            .then(result => {
                res(result);
            })
            .catch(err => {
                res(Boom.badRequest(err));
            });
    }
}]