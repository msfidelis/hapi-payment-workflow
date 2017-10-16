'use strict';

const ProductSchema = require('../models/Products');

const Joi = require('joi');
const Boom = require('boom');
const hash = require('take-my-hash');
const cache = require('../configs/cache');

module.exports = [
    {
        method: "DELETE",
        path: "/products/{id}",
        handler: (req, res) => {
            ProductSchema.remove({ "_id": req.params.id })
                .then(product => {

                    let productHash = hash.sha1('products' + req.params.id);
                    cache.del(productHash);
                    res(product).code(204);
                    
                })
                .catch(err => {
                    console.log(err);
                    res(Boom.internal(err));
                });
        },
        config: {
            validate: {
                params: {
                    id: Joi.string().required().min(20)
                }
            }
        }
    }
];