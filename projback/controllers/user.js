const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const { Order } = require('../models/order');

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'No User found in DB',
            });
        }
        req.profile = user;
        next();
    });
};

exports.getUser = (req, res) => {
    // TODO: get here for password -- DONE

    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    } else {
        User.findByIdAndUpdate(
            { _id: req.profile._id },
            { $set: req.body },
            { new: true, useFindAndModify: false },
            (err, user) => {
                if (err) {
                    return res.json({
                        error: 'You are not authorized to update this user',
                    });
                }
                user.salt = undefined;
                user.encry_password = undefined;
                user.createdAt = undefined;
                user.updatedAt = undefined;
                res.json(user);
            }
        );
    }
};

exports.userPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id })
        .populate('user', '_id name')
        .exec((err, order) => {
            if (err || !order) {
                return res.status(400).json({
                    error: 'No Order in this account',
                });
            }
            return res.json(order);
        });
};

//middleware to push order in purchase list of user model
exports.pushOrderInPurchaseList = (req, res, next) => {
    let purchases = [];
    req.body.order.products.forEach((product) => {
        purchases.push({
            _id: product._id,
            name: product.name,
            description: product.description,
            category: product.category,
            quantity: product.quantity,
            amount: req.body.order.amount,
            transaction_id: req.body.order.transaction_id,
        });
    });

    //store this in the DB
    User.findByIdAndUpdate(
        { _id: req.profile._id },
        { $push: { purchases: purchases } },
        { new: true },
        (err, user) => {
            if (err) {
                return res.status(400).json({
                    error: 'Unable to save purchase list',
                });
            }
            next();
        }
    );
};
