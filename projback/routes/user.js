const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const {
    getUser,
    getUserById,
    updateUser,
    userPurchaseList,
} = require('../controllers/user');

router.param('userId', getUserById);

// getUser route
router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);

// updateUser route
router.put(
    '/user/:userId',
    [
        check(
            'firstname',
            'your first name should be atleast 3 char'
        ).isLength({ min: 3 }),
        check('email', 'email is required').isEmail(),
        check('password')
            .isLength({ min: 5 })
            .withMessage('password must be at least 5 chars long'),
    ],
    isSignedIn,
    isAuthenticated,
    updateUser
);

// user purchaselist
router.get(
    '/order/user/:userId',
    isSignedIn,
    isAuthenticated,
    userPurchaseList
);

module.exports = router;
