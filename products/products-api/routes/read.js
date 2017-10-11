'use strict';

const Joi = require('joi');
const Boom = require('boom');

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

            ProductsSchema.findOne({ "_id": req.params.id })
                .then(product => {

                    if (!product) {
                        res(Boom.notFound());
                    } else {
                        res(product);
                    }

                })
                .catch(err => {
                    res(Boom.notFound(err));
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