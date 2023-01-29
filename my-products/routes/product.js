const express = require('express');
const router =  express.Router();

const { addProduct, 
        getProduct, 
        listProducts, 
        updateProduct,
        deleteProduct,
        removeAll
     } 
    = require('../controllers/product');

router.get('/health-check', (req, res)=>{
    res.send('--- Products Microservice ---');
});

router.post('/', addProduct);
router.get('/', listProducts);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/remove-all', removeAll);
router.delete('/:id', deleteProduct);

module.exports = router;