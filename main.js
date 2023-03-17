const express = require('express');

global.__basedir = require('path').resolve('./');
//parse the dot env
const env = require('dotenv').config({ path: __basedir + '/env/.env' })

const { PORT } = process.env;

const route = require('./routes/router');
const bodyParser = require('body-parser');
const errorHandler = require('./app/middleware/ErrorHandler')
const mongoose = require('./config/database.config');


const app = express();

app.use(bodyParser.urlencoded({ extended: true })) /**parse requests of content-type - application/x-www-form-urlencoded*/
app.use(bodyParser.json()) /**parse requests of content-type - application/json*/

// define a simple route
app.get('/', (req, res) => {
    res.status(200).json({ "message": "This is the landing page of blog API" });
});

// public route
app.use('/api/v1', route);

/** Standard error handling */
app.use(errorHandler)

/** catch all routes that are not defined and send response */
app.get('*', (req, res) => {
    res.status(404).json({
        "status": "error",
        "message": "Not Found",
        "data": null
    });
});

/**listen for requests */
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});