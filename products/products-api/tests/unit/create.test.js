"use strict";

const expect = require("chai").expect;
const assert = require("chai").assert;

const ProductModel = require('../../models/Products');
const productService = require('../../services/products');

describe("#Criação de Produtos", () => {

    it("#Cadastrando um produto com sucesso", (done) => {


        const productMock = {
            name: "Frigobar topzera",
            description: "Sonho de consumo pra sala de estar", 
            price: 400.90,
            tags: [
                'eletrodomestico', 'frigobar'
            ]
        };
        
        productService.createProduct(productMock).then(product => {

            expect(product).to.be.an('object');
            expect(product.name).to.be.equal(productMock.name);
            expect(product.description).to.be.equal(productMock.description);
            expect(product.price).to.be.equals(productMock.price);
            expect(product.tags).to.be.an('array');
            expect(product.tags[0]).to.be.equals(productMock.tags[0]);
            expect(product.tags[1]).to.be.equals(productMock.tags[1]);
            done();

        }).catch(err => done(err));

    });

    it("#Cadastrando um preço inválido", (done) => {
        
        const productMock = {
            name: "Frigobar topzera",
            description: "Sonho de consumo pra sala de estar", 
            price: "girocoptero"
        };

        const expectedMessage = 'Cast to Number failed for value "girocoptero" at path "price"';

        productService.createProduct(productMock).then(product => {
            done(product);
        }).catch(error => {
            expect(error.errors.price.message).to.be.equal(expectedMessage);
            done();
        })

    });

    it("#Cadastrando um nome inválido", (done) => {

        const productMock = {
            name: "",
            description: "Piruleibes", 
            price: 10.00
        };

        const expectedMessage = 'Path `name` is required.';

        productService.createProduct(productMock).then(product => {
            done(product);
        }).catch(error => {
            expect(error.errors.name.message).to.be.equal(expectedMessage);
            done();
        });


    });


    it("#Cadastrando uma descrição inválida", done => {

        const productMock = {
            name: "Sofá massa",
            description: "", 
            price: 99.00
        };

        const expectedMessage = 'Path `description` is required.';

        productService.createProduct(productMock).then(product => {
            done(product);
        }).catch(error => {
            expect(error.errors.description.message).to.be.equal(expectedMessage);
            done();
        });


    });
    
    afterEach(done =>  {
        ProductModel.remove({}).then(success => done());
    });    

});
