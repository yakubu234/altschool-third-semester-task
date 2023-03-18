const WebSocket = require('ws')
const sessions = require('express-session');
const api = require(__basedir + '/utils/answers.json')
const cookieHanler = require(__basedir + '/app/middleware/CoockieHandler')

let questions = api.map((item) => {
    return item.question
})


module.exports = (server) => {

    const wss = new WebSocket.Server({ server })

    wss.on('connection', (ws, req) => {

        cookieHanler(req);

        // Add listeners to the WebSocket
        ws.on('message', (message) => {
            if (message === 'exit') {
                ws.send(`You have disconnected`)
                ws.close()
            } else {
                // All socket clients are placed in an array
                wss.clients.forEach((client) => {
                    // Send message to each client in the loop
                    client.send(message)
                    // Loop through Q/A API
                    questions.forEach((question, index) => {
                        if (message.toLowerCase() === question) {
                            client.send(`hhmmnn: ${api[index].answer}`)
                        }
                    })
                })
            }
        })

        // Static welcome message sent from server
        ws.send(`Hi friend! I interact fast! Type '-help' for tips`)
    })

}