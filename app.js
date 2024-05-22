
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const transactions = require('./api/routes/transactions')

const bodyParser = require("body-parser")

app.use(bodyParser.json({ limit: '70mb' }))
app.use(bodyParser.urlencoded({ limit: '70mb', extended: false }))

app.use(morgan('dev'))

app.use((req, res, next) => {

    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    //res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Headers', '*');


    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
})

app.use(cors())

app.use(express.json())

// call routes
app.use('/trustedpayment/transactions', transactions)

// handling errors if none of the routes were accessed
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;