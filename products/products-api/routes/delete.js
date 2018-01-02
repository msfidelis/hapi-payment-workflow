'use strict';

const Joi = require('joi');
const Boom = require('boom');
const hash = require('take-my-hash');

const cache = require('../configs/cache');
const ProductService = require('../services/products');

module.exports = [
    {
        method: "DELETE",
        path: "/products/{id}",
        handler: (req, res) => {
            
            //Remove o produto informado pelo id
            ProductService
                .deleteProductById(req.params.id)
                .then(product => {

                    const productHash = hash.sha1('products' + req.params.id);
                    cache.del(productHash);
                    res(product).code(204);

                }).catch(err => res(Boom.internal(err)));
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