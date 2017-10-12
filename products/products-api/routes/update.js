'use strict';

const ProductSchema = require('../models/Products');

const Joi = require('joi');
const Boom = require('boom');

module.exports = [

    {
        method: "PUT",
        path: "/products/{id}",
        handler: (req, res) => {
            ProductSchema
                .findByIdAndUpdate(req.params.id, {$set: req.payload}, {new: true})
                .then(result => {

                    if (!result) {
                        let message = `Product ${req.params.id} not found`;
                        res(Boom.notFound(message));
                    } else {
                        res(result);
                    }

                })
                .catch(err => {
                    res(Boom.internal(err));
                });
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string(),
                    description: Joi.string(),
                    price: Joi.number(),
                    tags: Joi.array()
                }, 
                query: {
                    id: Joi.string()
                }
            }
        }
    }

]