'use strict';

const Joi = require('joi');
const Boom = require('boom');
const Hash = require('take-my-hash');

const cache = require('../configs/cache');

const ProductService = require('../services/products');

module.exports = [

    /**
     * Listagem de produtos
     * @default: Itens por página: 10
     */
    {
        method: "GET",
        path: "/products",
        handler: (req, res) => {

            // Paginations configs
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;

            const options = {
                select: '_id name price',
                limit: limit,
                page: page
            };

            const query = {};

            // Filtros opcionais
            if (req.query.tag) {
                query.tags = req.query.tag;
            }

            if (req.query.name) {
                query.name = new RegExp(`^${req.query.name}`, "i");
            }

            const searchhash = Hash.sha1(JSON.stringify(query) + JSON.stringify(options));

            // Procura a busca no cache do redis
            cache.getAsync(searchhash)
                .then(listcache => {

                    //Responde o cache para o usuário
                    if (listcache) {
                        listcache = JSON.parse(listcache);
                        res(listcache);
                    } else {
                        ProductService
                            .searchProductsWithPagination(query, options)
                            .then(products => {

                                //Seta o Item no cache com expiracão de 2 minutos e responde o request
                                cache
                                    .setAsync(searchhash, JSON.stringify(products), 'EX', 120)
                                    .then(success => res(products))
                                    .catch(err => res(Boom.internal(err)));

                            }).catch(err => res(err));
                    }
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
     * Detail do produto
     * Exibe mais detalhes que na listagem geral
     * Todo produto deve ser identificado pela hash do _id
     */
    {
        method: "GET",
        path: "/products/{id}",
        handler: (req, res) => {

            const productHash = Hash.sha1('products' + req.params.id);

            //Procura o id do produto no cache
            cache.getAsync(productHash)
                .then(productcache => {

                    //Verifica se o item existe no cache
                    if (productcache) {
                        productcache = JSON.parse(productcache);
                        res(productcache);
                    } else {
                        //Caso não exista no cache, o MongoDB é consultado
                        ProductService.findProductById(req.params.id )
                            .then(product => {

                                if (!product) {
                                    res(Boom.notFound());
                                } else {
                                    //Seta o item no Cache após encontrar o mesmo
                                    cache
                                        .setAsync(productHash, JSON.stringify(product), 'EX', 100)
                                        .then(success => res(product));
                                }

                            }).catch(err => res(Boom.notFound(err)));
                    }

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