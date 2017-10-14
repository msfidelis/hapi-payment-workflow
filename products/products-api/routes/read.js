'use strict';

const Joi = require('joi');
const Boom = require('boom');
const Hash = require('take-my-hash');

const cache = require('../configs/cache');
const hash = require('take-my-hash');

const ProductsSchema = require('../models/Products');

module.exports = [
    
    /**
     * Product Lists
     */
    {
        method: "GET",
        path: "/products",
        handler: (req, res) => {

            // Paginations configs
            let page = req.query.page || 1;
            let limit = req.query.limit || 10;

            let options = {
                select:'_id name price',
                limit: limit,
                page: page
            };

            let query = {};
            
            // Optional Filters
            if (req.query.tag) {
                query.tags = req.query.tag;
            }

            if (req.query.name) {
                query.name =  new RegExp(`^${req.query.name}`, "i");
            }

            ProductsSchema
                .paginate(query, options)
                .then(products => {
                    res(products);
                })
                .catch(err => {
                    res(err);
                });

        },
        config: {
            validate: {
                query: {
                    page: Joi.number(),
                    limit: Joi.number(),
                    tag: Joi.string(),
                    name: Joi.string()
                }
            }
        }
    },

    /**
     * Product Detail
     */
    {
        method: "GET",
        path: "/products/{id}",
        handler: (req, res) => {

            let productHash = hash.sha1('products' + req.params.id);
            
            //Procura o id do produto no cache
            cache.getAsync(productHash)
            .then(productcache => {
                //Verifica se o item existe no cache
                if (productcache) {
                    console.log("Veio do cache");
                    productcache = JSON.parse(productcache);
                    res(productcache);
                } else {
                    //Caso não exista no cache, o MongoDB é consultado
                    console.log("Não veio do cache");
                    ProductsSchema.findOne({ "_id": req.params.id })
                    .then(product => {
                                
                        if (!product) {
                            res(Boom.notFound());
                        } else {
                            // Seta o item no Cache após encontrar o mesmo
                            cache.setAsync(productHash, JSON.stringify(product)) 
                            .then(success => {
                                res(product);
                            });
                        }
    
                    }).catch(err => {
                        res(Boom.notFound(err));
                    });
                }

            }).catch(err => {
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