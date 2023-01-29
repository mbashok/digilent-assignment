/**
 * Script Info
 * 
 * This is the test script to run and test the indiviual REST api.
 * Find the list NPM test commands.
 * 
 * 1. Init/import seed data into database
 * --------------------------------------
 *  npm test --action=init
 * 
 * 
 * 2. List products
 * ----------------
 *  a) List top 5 most viewed products
 *      npm test --action=list
 *  b) List top 10 most viewed products
 *      npm test --action=list --row_limit=10
 *  c) List top 10 most viewed products with currency EUR
 *      npm test --action=list --row_limit=10 --prod_currency=EUR
 * 
 * 
 * 3. Add a new product
 * --------------------
 *      npm test --action=add --prod_name="Sun Glass" --prod_desc="Ray-Ban sun glass" --prod_price=10
 * 
 * 
 * 4. Get a product detail
 * -----------------------
 *  a) Product detail by default currency rate USD
 *      npm test --action=get --id=63d65db35bdca4c5591a20e3 
 *  b) Product detail with currency CAD
 *      npm test --action=get --id=63d65db35bdca4c5591a20e3 --prod_currency=CAD
 * 
 * 
 * 5. Update the product detail
 * ----------------------------
 *  npm test --action=update --id=63d65db35bdca4c5591a20e3 --prod_name="Sun Glass 1" --prod_desc="Ray-Ban aviator sun glass" --prod_price=12
 * 
 * 
 * 6. Delete a product (soft delete)
 * ---------------------------------
 *  npm test --action=delete --id=63d65db35bdca4c5591a20e3
 * 
 */

const async = require('async');

//Data seed to init the database with some sample data.
const dataSeed = [
    {
        name: 'Sun Glass',
        description: 'Ray-Ban Aviator sun glass',
        price: 100,
        viewCount: 1
    },
    {
        name: 'Formal Shirt',
        description: 'Peter-England Aviator sun glass',
        price: 100,
        viewCount: 0
    },
    {
        name: 'Jeans Trousers',
        description: 'Liv-in Skin fit jeans for men',
        price: 30,
        viewCount: 5
    },
    {
        name: 'Sports Shoes',
        description: 'Woodland Sports shoes for women',
        price: 45,
        viewCount: 10
    },
    {
        name: 'Wrist watch',
        description: 'Rolex Wrist watches for men',
        price: 36,
        viewCount: 21
    },
    {
        name: 'Nike Shoes',
        description: 'Sports shoes for men',
        price: 45,
        viewCount: 3
    },
    {
        name: 'Back Pack',
        description: 'Wild-Craft Ray-Ban Aviator sun glass',
        price: 35,
        viewCount: 8
    },
];

const _addAPI = function(product, callback){
    fetch('http://localhost:3000/api/products',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product)
        }
    )
    .then(res => res.json())
    .then(data => {
        console.log(data);
        callback();
    })
    .catch(error => {
        callback(error);
    })  
};

const _listAPI = function(currency, limit, callback){
    fetch(`http://localhost:3000/api/products?currency=${currency}&limit=${limit}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    .then(res => res.json())
    .then(data => {
        callback(null, data);
    })
    .catch(error => {
        callback(error);
    })  
};

const _getAPI = function(id, currency, callback){
    if(!id){
        console.log("Missig args 'id'");
        callback();
    }

    fetch(`http://localhost:3000/api/products/${id}?currency=${currency}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    .then(res => res.json())
    .then(data => {
        callback(null, data);
    })
    .catch(error => {
        callback(error);
    })  
};

const _updateAPI = function(id, data, callback){
    if(!id){
        console.log("Missig args 'id'");
        callback("Missing args");
    }
    if(!data){
        console.log("Missig args data");
        callback("Missing args");
    }
    fetch(`http://localhost:3000/api/products/${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }
    )
    .then(res => res.json())
    .then(data => {
        callback(null, data);
    })
    .catch(error => {
        callback(error);
    })  
};

const _deleteAPI = function(id, callback){
    if(!id){
        console.log("Missig args 'id'");
        callback();
    }

    fetch(`http://localhost:3000/api/products/${id}`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    .then(res => res.json())
    .then(data => {
        callback(null, data);
    })
    .catch(error => {
        callback(error);
    })  
};

const _removeAllApi = function(callback){
    fetch('http://localhost:3000/api/products/remove-all',
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        }
    )
    .then(res => res.json())
    .then(data => {
        console.log("All old products are deleted from db");
        callback();
    })
    .catch(error => {
        callback(error);
    })  
};

const importSeed = function(products){
    async.waterfall(
        [
            function(cb) { // Delete all existing products
                _removeAllApi(cb)
            },
            function(cb) {
                async.each(products, _addAPI, cb);
            }
        ],
        function(err, res){
            if( err ) {
                console.log(err);
            } else {
                console.log('All products have been inserted successfully');
            }
        }
    );
    
}

const listProducts =  function(currency, limit){
    _listAPI(currency, limit, (err, result) => {
        if(err) {
            console.log(err)
        }
        else{
            console.log("------------------ Products list ----------------");
            console.log(result);
            console.log("--------------------------------------------------");
        }
    });
}

const addProduct =  function(productInfo){
    _addAPI(productInfo, (err, result) => { 
        if(err) {
            console.log(err);
        }
        else{
            console.log("------------------ New product added successfully ----------------");
            console.log(result);
            console.log("--------------------------------------------------");
        }
    });
}

const getProductDetail =  function(id, currency){
    _getAPI(id, currency, (err, result) => {
        if(err) {
            console.log(err)
        }
        else{
            console.log("------------------ Product Detail ----------------");
            console.log(result);
            console.log("--------------------------------------------------");
        }
    });
}

const updateProduct =  function(id, productInfo){
    _updateAPI(id, productInfo, (err, result) => { 
        if(err) {
            console.log(err);
        }
        else{
            console.log("------------------ Product updated successfully ----------------");
            console.log(result);
            console.log("--------------------------------------------------");
        }
    });
}

const deleteProduct =  function(id){
    _deleteAPI(id, (err, result) => {
        if(err) {
            console.log(err)
        }
        else{
            console.log(`Product with id ${id} deleted successfully.`);
        }
    });
}

const action = process.env && process.env.npm_config_action;
const product_id = process.env && process.env.npm_config_id;
let name, description, price, productIngo, currency, row_limit;

switch(action){
    case 'init':
        importSeed(dataSeed);
        break;
    case 'list':
        currency = process.env.npm_config_prod_currency;
        row_limit = process.env.npm_config_row_limit || 5;
        listProducts(currency, row_limit);
        break;
    case 'add':
        name = process.env.npm_config_prod_name;
        description = process.env && process.env.npm_config_prod_desc;
        price = process.env.npm_config_prod_price;
        productInfo = {name, description, price};
        addProduct(productInfo);
        break;
    case 'get':
        currency = process.env && process.env.npm_config_prod_currency;
        getProductDetail(product_id, currency);
        break;
    case 'update':
        name = process.env.npm_config_prod_name;
        description = process.env && process.env.npm_config_prod_desc;
        price = process.env.npm_config_prod_price;
        productInfo = {name, description, price};
        updateProduct(product_id, productInfo);
        break;
    case 'delete':
        deleteProduct(product_id);
        break;
    default:
        console.log('----------------------------------------');
        console.log("Invalid action. Try with valid arguments");
        console.log('----------------------------------------');
        break;
}