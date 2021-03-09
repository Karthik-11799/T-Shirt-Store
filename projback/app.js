require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Routing config
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
// const stripeRoutes = require('./routes/stripepayment');
const brainTreeRoutes = require('./routes/braintree');

// DB Connection
mongoose
    .connect(process.env.DBURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log('DB CONNECTED');
    })
    .catch((err) => {
        console.log('DB NOT CONNECTED');
    });

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// My ROUTES
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
// app.use('/api', stripeRoutes);
app.use('/api', brainTreeRoutes);

// PORT
const port = process.env.PORT || 4000;

// Starting a Server
app.listen(port, () => {
    console.log(`App is listening to port ${port}`);
});
