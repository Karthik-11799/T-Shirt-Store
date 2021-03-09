const express = require('express');
const router = express.Router();

const {
    getProductById,
    createProduct,
    getProduct,
    photo,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getAllUniqueCategories,
} = require('../controllers/product');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');

// PARAMS

router.param('productId', getProductById);
router.param('userId', getUserById);

// ROUTES

// create route
router.post(
    '/product/create/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createProduct
);

// get product
router.get('/product/:productId', getProduct);
router.get('/product/photo/:productId', photo);

// update product
router.put(
    '/product/:productId/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateProduct
);

// delete product
router.delete(
    '/product/:productId/:userId',
    isSignedIn,
    isAuthenticated,
    isAdmin,
    deleteProduct
);

// listing products
router.get('/products', getAllProducts);

router.get('/product/categories', getAllUniqueCategories);

module.exports = router;
