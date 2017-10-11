'use strict';

const Joi = require('joi');
const Boom = require('boom');

const ProductSchema = require('../models/Products');

module.exports = [
    {
        method: "POST",
        path: "/products",
        handler: (req, res) => {

            let product = new ProductSchema(req.payload);

            product.save()
            .then(newProduct => {
                res(newProduct).code(201);
            }).catch(err => {
                Boom.internal(err);
            });

        },
        config: {
            validate: {
                payload: {
                    name: Joi.string().required(),
                    description: Joi.string().required(),
                    price: Joi.number().required(),
                    tags: Joi.array()
                }
            }
        }
    }
];