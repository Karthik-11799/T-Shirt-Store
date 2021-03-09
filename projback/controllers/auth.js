const User = require('../models/user');
const { check, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                error: 'NOT able to save user in DB',
            });
        }
        res.json({
            name: user.firstname,
            email: user.email,
            id: user._id,
        });
    });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ error: errors.array()[0].msg });
    }

    User.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(400).json({ error: 'Something went wrong' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Email id does not exists' });
        }

        if (!user.authenticate(password)) {
            return res.json({ error: 'password not matched' });
        }

        // create token
        var token = jwt.sign({ _id: user._id }, process.env.SECRET);
        // put token in cookie
        res.cookie('token', token, { expire: 360000 + Date.now() });

        // send response to front end
        const { _id, firstname, email, role } = user;
        return res.json({ token, user: { _id, firstname, email, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie();
    res.json({ message: 'User has been signed out' });
};

// protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: 'auth',
});

//middleware
exports.isAuthenticated = (req, res, next) => {
    // let checker = req.profile && req.auth && req.profile._id.equals(req.auth._id);
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: 'ACCESS DENIED',
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'You are not an ADMIN, Access Denied',
        });
    }
    next();
};
