const express = require('express');
const app = express();

const isLoggedIn = (req, res, next) => {
    console.log('user is logged in');
    next();
}
const admin = false;

const isAdmin = (req, res, next) => {
    if (admin) {
        console.log('admin is running');
        next();
    }
    else {
        res.send('You are not an admin')
    }
}


const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is listening to port ${port}`)
})