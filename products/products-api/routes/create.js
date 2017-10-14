'use strict';

const Joi = require('joi');
const Boom = require('boom');
const hash = require('take-my-hash');

const cache = require('../configs/cache');

const ProductSchema = require('../models/Products');

module.exports = [
    {
        method: "POST",
        path: "/products",
        handler: (req, res) => {

            let product = new ProductSchema(req.payload);

            product.save()
            .then(newProduct => {

                let productHash = hash.sha1('products' + newProduct._id);

                //Seta o novo item no Redis - Cria já cacheando
                cache.setAsync(productHash, JSON.stringify(newProduct), 'EX', 100)
                    .then(success => {
                        res(newProduct).code(201);
                    }).catch(err => {
                        console.log(err);
                        res(Boom.internal(err));
                    });
                
            }).catch(err => {
                res(Boom.internal(err));
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