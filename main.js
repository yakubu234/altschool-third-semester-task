'use strict';

const express = require('express');
var cors = require('cors')
const session = require('express-session');
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const http = require('http')
const bodyParser = require('body-parser');

/** get the base path, then add it as a global variable. */
global.__basedir = require('path').resolve('./');

/** parse the dot env and get the port */
require('dotenv').config({ path: __basedir + '/env/.env' })
const { PORT, ALLOWED_ORIGIN, SESSION_SECRET, DOMAIN } = process.env;

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

var whitelist = ["http://localhost:3000", "http://localhost:2000", 'http://third.mockup.com.ng', 'https://third.mockup.com.ng']
var corsOptions = {
    origin: whitelist,
    credentials: true,
};

app.options(cors(corsOptions));
app.use(cors(corsOptions));

//sessions is here 
app.use(helmet());
app.use(cookieParser("293e8ujd0aw9i32jemdoiawj"));

var sess = session({
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
        path: "/",
        _expires: null,
        maxAge: null,
        name: `FoodOrderBot`,
        domain: DOMAIN,
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax', // must be 'none' to enable cross-site delivery
    },
    resave: false,
})

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

app.use(sess)

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/uuid', (req, res) => {
    req.session.clientID = req.body.uuid
    res.end()
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
    res.end()
});

/* Connect express app and the websocket server  */
const server = http.createServer(app)

/** the websocket begins here */
ws(server, sess);

/**listen for requests */
server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});