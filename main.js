const express = require('express');
const http = require('http')
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');

/** get the base path, then add it as a global variable. */
global.__basedir = require('path').resolve('./');

/** parse the dot env and get the port */
require('dotenv').config({ path: __basedir + '/env/.env' })
const { PORT } = process.env;

const errorHandler = require(__basedir + '/app/middleware/ErrorHandler')
require(__basedir + '/config/database.config');
const ws = require(__basedir + '/utils/ws.connection')

const app = express();

/**parse requests of content-type - application/x-www-form-urlencoded*/
app.use(bodyParser.urlencoded({ extended: true }))

/**parse requests of content-type - application/json*/
app.use(bodyParser.json())

/** serving public file , the cookie parser and show the bot page */
app.use(express.static('views'));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
});

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


/* Connect express app and the websocket server  */
const server = http.createServer(app)

/** the websocket begins here */
ws(server);

/**listen for requests */
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});