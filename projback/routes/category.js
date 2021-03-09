const express = require('express');
const route = express.Router();

const { getcategoryById, createCategory, getCategory, getAllCategory, updateCategory, deleteCategory } = require('../controllers/category');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const router = require('./user');


// PARAMS 
router.param('userId', getUserById);
router.param('categoryId', getcategoryById);

// create 
router.post('/category/create/:userId', isSignedIn, isAuthenticated, isAdmin, createCategory);

// read 
router.get('/category/:categoryId', getCategory);
router.get('/categories', getAllCategory);

// update 
router.put('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, updateCategory)

// delete
router.delete('/category/:categoryId/:userId', isSignedIn, isAuthenticated, isAdmin, deleteCategory)

module.exports = router;