'use strict';

const ProductsSchema = require('../models/Products');

module.exports = [

    {
        method: "GET",
        path: "/products",
        handler: (req, res) => {

            ProductsSchema.find()
                .then(products => {
                    res(products);
                })
                .catch(err => {
                    res(err);
                });

        }
    }

];