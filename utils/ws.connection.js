const WebSocket = require('ws')
// const sessions = require('express-session');
const api = require(__basedir + '/utils/answers.json')
// const cookieHanler = require(__basedir + '/app/middleware/CoockieHandler')

let questions = api.map((item) => {
    return item.question
})


module.exports = (server, sess) => {

    const wss = new WebSocket.Server({
        verifyClient: (info, done) => {
            sess(info.req, {}, () => {
                // console.log('session')
                // if (info.req.session.clientID == undefined) {
                //     info.req.session.clientID = "238eq283he7283"
                // }
                done(info.req.session.clientID)
            })

        }, server
    })

    wss.on('connection', (ws, req) => {
        console.log(sess)
        // cookieHanler(req);
        // Add listeners to the WebSocket
        ws.on('message', (message) => {

            console.log(`${req.session.clientID}`)
            if (message === 'exit') {
                ws.send(`You have disconnected`)
                ws.close()
            } else {
                // All socket clients are placed in an array
                wss.clients.forEach((client) => {

                    // Loop through Q/A API
                    questions.forEach((question, index) => {
                        if (message === question) {
                            client.send(`hhmmnn: ${api[index].answer}`)
                        }
                    })

                    client.send('i am here')


                })
            }
        })

        // Static welcome message sent from server
        ws.send(`Hi friend! I interact fast! Type '-help' for tips`)
    })

}