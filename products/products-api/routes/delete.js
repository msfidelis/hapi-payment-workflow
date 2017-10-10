'use strict';

const ProductSchema = require('../models/Products');

module.exports = [{
    method: "DELETE",
    path: "/products/{id}",
    handler: (req, res) => {
        ProductSchema.remove({ "_id": req.params.id })
            .then(product => {
                res(product).code(204);
            })
            .catch(err => {
                console.log(err);
            });
    }
}]