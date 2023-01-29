const mongoose = require('mongoose');
const Product = require('../models/products');
const { convert } = require('../services/currency');

// Create a product
const addProduct = async function(req, res, next){
    try{
        const product = new Product(req.body);
        const savedProduct = await product.save();
        res.json(savedProduct);
    }
    catch(error){
        res.status(500).send({error: error.message});
    }
    
};

// Find a product detail
const getProduct = async function(req, res, next){
    try{
        let services = [
            Product.findOneAndUpdate(
                {_id: mongoose.Types.ObjectId(req.params.id)},
                {$inc: {viewCount: 1}},
                {new: true}
            )
        ];
    
        if( req.query.currency !== undefined && req.query.currency !== 'USD'){
            services.push( convert('USD', req.query.currency) );
        }
    
        const [product, currency] = await Promise.all(services);
    
        if(currency && currency.success) {
            product.currency = currency.query.to;
            product.price = parseFloat(product.price*currency.result).toFixed(2);
        }
        res.json({product});
    }
    catch(error){
        res.status(500).send({error: error.message});
    }
};

// List all products and short by most recent views
const listProducts = async function(req, res, next){
    let pageLimit = req.query.limit || 5;

    try {
        let services = [ 
            Product.find({deleted: false, viewCount:{$gt:0}}) // Fetch only active products and atleast 1 view
            .sort({viewCount: -1})
            .limit(pageLimit)
        ];
    
        if( req.query.currency && req.query.currency !== 'USD') {
            services.push( convert('USD', req.query.currency) );
        }
        const [products, currency] = await Promise.all(services);
    
        if(currency && currency.success) {
            products.map(product => {
                product.currency = currency.query.to;
                product.price = parseFloat(product.price * currency.result).toFixed(2);
            });
        }
        res.json({products});
    }
    catch(error){
        res.status(500).send({error: error.message});
    }
};

// Update the product detail`
const updateProduct = async function(req, res, next) {
    const obj = req.body;
    try {
        const result = await Product.findOneAndUpdate(
            {_id: mongoose.Types.ObjectId(req.params.id)},
            obj,
            {new: true, upsert: false}
        );
        res.json(result);
    }
    catch(error){
        res.status(500).send({error: error.message});
    }
}

// Delete a product (soft delete)
const deleteProduct = async function(req, res, next){
    try {
        const product = await Product.findOneAndUpdate(
            {_id: mongoose.Types.ObjectId(req.params.id)},
            {deleted: true},
            {new: true, upsert: false});
        res.json({message: 'Product deleted successfully'});
    }
    catch(error){
        res.status(500).send({error: error.message});
    }
};

// Delete all products. 
// This is to clear the db for testing purpose
const removeAll = async function(req, res, next){
    try {
        const product = await Product.deleteMany({});
        res.json({message: 'All product are deleted successfully'});
    }
    catch(error){
        res.status(500).send({error: error.message});
    }
};

module.exports = {
    addProduct: addProduct,
    getProduct: getProduct,
    updateProduct: updateProduct,
    listProducts: listProducts,
    deleteProduct: deleteProduct,
    removeAll: removeAll
};