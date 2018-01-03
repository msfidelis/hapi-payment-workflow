'use strict';

const ProductSchema = require('../models/Products');

const ProductService = {
    
    createProduct : productValues => { 
        return new ProductSchema(productValues).save();
    },    

    updateProduct : (id, productValues) => { 
        return ProductSchema.findByIdAndUpdate(id, {$set: productValues}, {new: true});
    },

    findProductById: id => {
        return ProductSchema.findOne({_id: id});
    },

    searchProductsWithPagination : (query = {}, paginationOptions = {}) => {
        return ProductSchema.paginate(query, paginationOptions);
    },
    
    deleteProductById : id =>  {
        return ProductSchema.remove({_id: id});
    } 

}

module.exports = ProductService;