"use strict";

const expect = require("chai").expect;
const assert = require("chai").assert;

const productModel = require('../../models/Products');
const productService = require('../../services/products');

describe("#Listagem de Produtos", () => {


    it("Listagem geral", done => {

        const options = {
            page: 1, 
            limit: 10
        };

        //Cadastrando dois produtos
        const mock1 = {
            name: "Frigobar topzera",
            description: "Sonho de consumo pra sala de estar", 
            price: 19.00
        };

        const mock2 = {
            name: "Maquina de lavar loka",
            description: "Tira até as manchas de gordura", 
            price: 1500.00
        };

        Promise.all([
            productService.createProduct(mock1),
            productService.createProduct(mock2)
        ]).then(success => {

            productService.searchProductsWithPagination({}, options).then(products => {
                console.log(products);
                done();
            });

        });

    });

    it("Detail", done => {
        done();
    });

    it("Filtros", done => {
        done();
    });

    afterEach(done =>  {
        productModel.remove({}).then(success => done());
    });  

});