const sessions = require('express-session');
const express = require('express');
const app = express();

module.exports = (req) => {
    session = req.session;

    if (session) {
        console.log(session)
    }

    if (!session) {
        req.headers['x-user-id'] = "idis here";

        //sessions is here 
        var sess = {
            saveUninitialized: true,
            secret: 'keyboard cat',
            cookie: { clientID: "idis here" },
            resave: false
        }

        // if (app.get('env') === 'production') {
        //     app.set('trust proxy', 1) // trust first proxy
        //     sess.cookie.secure = true // serve secure cookies
        // }

        app.use(sessions(sess))
    }

    return;

};