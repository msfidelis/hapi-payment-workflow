'use strict';

const ProductSchema = require('../models/Products');

const Joi = require('joi');
const Boom = require('boom');

const hash = require('take-my-hash');
const cache = require('../configs/cache');

/**
 * Atualiza um produto informado pela ID
 * PUT /products/{id}
 */
module.exports = [

    {
        method: "PUT",
        path: "/products/{id}",
        handler: (req, res) => {

            //Encontra o Item e atualiza o mesmo
            ProductSchema
                .findByIdAndUpdate(req.params.id, {$set: req.payload}, {new: true})
                .then(result => {

                    //Caso o mesmo não exista, retorna um status de 404
                    if (!result) {
                        let message = `Product ${req.params.id} not found`;
                        res(Boom.notFound(message));
                    } else {

                        let productHash = hash.sha1('products' + req.params.id);

                        // Seta o item atualizado no cache
                        cache.setAsync(productHash, JSON.stringify(result), 'EX', 100)
                            .then(success => {
                                console.log("Atualizou o cache");
                                res(result);
                            }).catch(err => {
                                console.log(err);
                                res(Boom.internal(err));
                            });
                        
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
                    id: Joi.string().required()
                }
            }
        }
    }

]