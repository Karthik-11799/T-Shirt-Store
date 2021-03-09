const Product = require('../models/product');
var formidable = require('formidable');
const _ = require('lodash')
var fs = require('fs');
const product = require('../models/product');
const category = require('../models/category');


// Middleware
exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate('category')
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Product not found in DB"
                })
            }
            req.product = product;
            next();
        })
}

// CREATE product
exports.createProduct = (req, res) => {
    var form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with Image"
            })
        }

        // console.log('Fields', fields);
        // console.log('=============');
        // console.log('File', file);

        // destructuring the fields
        const { name,
            description,
            price,
            category,
            stock
        } = fields;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return res.status(400).json({
                error: "Please include all the fields"
            })
        }

        //TODO: Restrictions on field - DONE

        let product = new Product(fields);

        // Handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "Image should be lesser than 3MB"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // console.log('**********');
        // console.log(product);

        // save to the DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: 'Cannot save product'
                })
            }
            res.json(product);
        })
    });
}

// GET product
exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
}

// Middleware for optimization of binary data
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

// UPDATE product
exports.updateProduct = (req, res) => {
    var form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "Problem with Image"
            })
        }

        let product = req.product;
        product = _.extend(product, fields);

        // Handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "Image should be lesser than 3MB"
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        // Update the DB
        product.save((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: 'Product Updation failed'
                })
            }
            res.json(product);
        })
    });
}

// DELETE product
exports.deleteProduct = (req, res) => {
    let product = req.product;

    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete product"
            })
        }
        res.json({
            message: `${product.name} product is deleted`
        });
    })
}

// Listing all products
exports.getAllProducts = (req, res) => {

    let limit = req.query.limit ? req.query.limit : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';

    Product.find()
        .select('-photo') //unselect photo
        .populate('category')
        .sort([[sortBy, 'asc']])
        .limit(limit)
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: "NO products FOUND"
                });
            }
            res.json(products);
        })
}

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct('category', {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: 'No Categories found'
            })
        }
        res.json(category);
    })
}

// Middleware
exports.updateStock = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne: {
                filter: { _id: prod._id },
                update: { $inc: { stock: -prod.count, sold: +prod.count } }
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            res.status(400).json({
                error: 'Bulk Operation failed'
            })
        }
        next();
    })
}
