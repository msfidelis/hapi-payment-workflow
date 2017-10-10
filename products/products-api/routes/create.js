'use strict';

const ProductSchema = require('../models/Products');

module.exports = [

    {
        method: "POST",
        path: "/products",
        handler: (req, res) => {

            let newProduct = new ProductSchema(req.payload);

            newProduct.save()
                .then(product => {
                    res(product).code(201);
                })
                .catch(err => {
                    console.log(err);
                    res(err);
                });


        }
    }

];