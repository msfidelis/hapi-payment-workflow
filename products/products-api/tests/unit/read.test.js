"use strict";

const expect = require("chai").expect;
const assert = require("chai").assert;

const productModel = require('../../models/Products');
const productService = require('../../services/products');

describe("#Listagem de Produtos", () => {

    it("#Busca - Listagem geral", done => {

        const options = {
            page: 1, 
            limit: 10
        };

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
                expect(products).to.be.an('object');
                expect(products.docs).to.be.an('array');
                expect(products.docs).to.have.lengthOf(2);
                done();
            });
        });

    });

    it("#Busca - Detail", done => {

        const mock = {
            name: "Frigobar topzera",
            description: "Sonho de consumo pra sala de estar", 
            price: 19.00
        };

        // Cria um produto
        productService.createProduct(mock).then(newproduct => {

            //Pesquisa pelo produto criado
            productService.findProductById(newproduct._id).then(product => {

                expect(product).to.be.an('object');
                expect(product.name).to.be.equal(newproduct.name);
                expect(product.description).to.be.equal(newproduct.description);
                expect(product.price).to.be.equal(newproduct.price);
            
                done();

            }).catch(err => done(err));

        });

    });

    it("#Filtros - Tags", done => {

        const options = {
            page: 1, 
            limit: 10
        };

        const mock1 = {
            name: "Frigobar topzera",
            description: "Sonho de consumo pra sala de estar", 
            price: 19.00,
            tags : [
                "frigobar"
            ]
        };

        const mock2 = {
            name: "Microondas maneirão",
            description: "Pronto pra sua lasanha da Sadia!", 
            price: 1500.00,
            tags : [
                "microondas"
            ]
        };

        const query = {
            tags : "frigobar"
        };

        Promise.all([
            productService.createProduct(mock1),
            productService.createProduct(mock2)
        ]).then(success => {

            productService.searchProductsWithPagination(query, options).then(results => {

                expect(results).to.be.an('object');
                expect(results.docs).to.be.an('array');
                expect(results.docs).to.have.lengthOf(1);
                expect(results.docs[0].name).to.be.equal(mock1.name);
                expect(results.docs[0].description).to.be.equal(mock1.description);
                expect(results.docs[0].price).to.be.equal(mock1.price);
                done();

            }).catch(err => done(err));

        });

    });

    it("#Filtros - Name", done => {

        const options = {
            page: 1, 
            limit: 10
        };

        const mock1 = {
            name: "Frigobar topzera",
            description: "Sonho de consumo pra sala de estar", 
            price: 19.00,
            tags : [
                "frigobar"
            ]
        };

        const mock2 = {
            name: "Microondas maneirão",
            description: "Pronto pra sua lasanha da Sadia!", 
            price: 1500.00,
            tags : [
                "microondas"
            ]
        };

        const query = {
            name : /maneirão/
        };

        Promise.all([
            productService.createProduct(mock1),
            productService.createProduct(mock2)
        ]).then(success => {

            productService.searchProductsWithPagination(query, options)
            .then(results => {

                expect(results).to.be.an('object');
                expect(results.docs).to.be.an('array');
                expect(results.docs).to.have.lengthOf(1);
                expect(results.docs[0].name).to.be.equal(mock2.name);
                expect(results.docs[0].description).to.be.equal(mock2.description);
                expect(results.docs[0].price).to.be.equal(mock2.price);
                done();

            }).catch(err => done(err));

        });

    });

    it("#Filtros - Description", done => {

        const options = {
            page: 1, 
            limit: 10
        };

        const mock1 = {
            name: "Frigobar topzera",
            description: "Sonho de consumo pra sala de estar", 
            price: 19.00,
            tags : [
                "frigobar"
            ]
        };

        const mock2 = {
            name: "Microondas maneirão",
            description: "Pronto pra sua lasanha da Sadia!", 
            price: 1500.00,
            tags : [
                "microondas"
            ]
        };

        const query = {
            description : /sala de estar/
        };

        Promise.all([
            productService.createProduct(mock1),
            productService.createProduct(mock2)
        ]).then(success => {

            productService.searchProductsWithPagination(query, options)
            .then(results => {
                
                expect(results).to.be.an('object');
                expect(results.docs).to.be.an('array');
                expect(results.docs).to.have.lengthOf(1);
                expect(results.docs[0].name).to.be.equal(mock1.name);
                expect(results.docs[0].description).to.be.equal(mock1.description);
                expect(results.docs[0].price).to.be.equal(mock1.price);
                done();

            }).catch(err => done(err));

        });

    });

    it("#Paginação - Limite de Itens por Página", done => {

        const options = {
            page: 1, 
            limit: 10
        };

        const mock1 = {
            name: "Frigobar topzera",
            description: "Sonho de consumo pra sala de estar", 
            price: 19.00,
            tags : [
                "frigobar"
            ]
        };

        const mock2 = {
            name: "Microondas maneirão",
            description: "Pronto pra sua lasanha da Sadia!", 
            price: 1500.00,
            tags : [
                "microondas"
            ]
        };

        Promise.all([
            productService.createProduct(mock1),
            productService.createProduct(mock2)
        ]).then(success => {
            
            

        })

        done();
    });

    afterEach(done =>  {
        productModel.remove({}).then(success => done());
    });  

});