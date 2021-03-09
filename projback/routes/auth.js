var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');

const { signout, signup, signin, isSignedIn } = require('../controllers/auth');

router.post(
    '/signup',
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
    signup
);

router.post('/signin', [check('email', 'email is required').isEmail()], signin);

router.get('/signout', signout);

router.get('/test', isSignedIn, (req, res) => {
    res.json(req.auth);
});

module.exports = router;
