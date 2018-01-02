'use strict';

const Joi = require('joi');
const Boom = require('boom');

const hash = require('take-my-hash');
const cache = require('../configs/cache');

const ProductService = require('../services/products');

/**
 * Atualiza um produto informado pela ID
 * PUT /products/{id}
 */
module.exports = [

    {
        method: "PUT",
        path: "/products/{id}",
        handler: (req, res) => {

            //Procura o item no Mongo e atualiza o mesmo
            ProductService
                .updateProduct(req.params.id, req.payload)
                .then(result => {

                    //Caso o mesmo não exista, retorna um status de 404
                    if (!result) {
                        let message = `Product ${req.params.id} not found`;
                        res(Boom.notFound(message));
                    } else {
                        // Seta o item atualizado no cache
                        const productHash = hash.sha1('products' + req.params.id);
                        cache.setAsync(productHash, JSON.stringify(result), 'EX', 100)
                            .then(success => res(result))
                            .catch(err => res(Boom.internal(err)));
                    }

                }).catch(err => res(Boom.internal(err)));
        },
        config: {
            validate: {
                payload: {
                    name: Joi.string(),
                    description: Joi.string(),
                    price: Joi.number(),
                    tags: Joi.array()
                }, 
                params: {
                    id: Joi.string().required().min(20)
                }
            }
        }
    }

]