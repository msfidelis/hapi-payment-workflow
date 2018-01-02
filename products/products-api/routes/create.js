'use strict';

const Joi = require('joi');
const Boom = require('boom');
const hash = require('take-my-hash');

const cache = require('../configs/cache');
const ProductsService = require('../services/products');

/**
 * Rota de criação de produtos
 * Espera um payload parecido com 
 * {
 *   "name": "Microondas Top",
 *   "description": "Microondas Dahora. Perfeito pra Lasanhas da Sadia!", 
 *   "price": 900.00,
 *   "tags": [
 *       "eletrodomestico", "microondas"
 *   ]
 *  }
 */
module.exports = [{
    method: "POST",
    path: "/products",
    handler: (req, res) => {

        ProductsService.createProduct(req.payload)
            .then(newProduct => {
                //Seta o novo item no Redis - Cria já cacheando
                const productHash = hash.sha1('products' + newProduct._id);

                cache.setAsync(productHash, JSON.stringify(newProduct), 'EX', 100)
                    .then(success => res(newProduct).code(201))
                    .catch(err => res(Boom.internal(err)));

            }).catch(err => res(Boom.internal(err)));

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
}];