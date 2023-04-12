
const SocketServer = require('ws').Server;
const sessions = require('express-session');
const api = require(__basedir + '/utils/answers.json')
const answers = require(__basedir + '/utils/Answers.js')

module.exports = (server, sess) => {

    let questions = api.map((item) => {
        return item.question
    })

    const wss = new SocketServer({ server })

    wss.on('error', console.error)

    const clients = new Map();
    wss.on('connection', (ws, req) => {
        const randMessage = "Hi friend!<br><br> \n enter 1 to place an order \n<br> enter 99 to checkout order \n <br>enter 98 to see order history <br>\n enter 97 to see current order <br>\n enter 0 to cancel an order";

        const id = uuidv4();
        const color = Math.floor(Math.random() * 360);
        const metadata = { id, color };

        clients.set(ws, metadata);
        // Add listeners to the WebSocket
        ws.on('message', (message) => {
            let userMessage = message.toString()
            if (userMessage === 'exit') {
                ws.send(`You have disconnected`)
                ws.close()
            } else {
                // All socket clients are placed in an array
                wss.clients.forEach((client) => {

                    const response = answers(userMessage.toLowerCase());

                    if (!response) {
                        client.send('sorry the value entered cannot be processed')
                        client.send(randMessage)
                    } else {
                        client.send(response)
                    }

                })

            }
        })

        // Static welcome message sent from server
        ws.send(randMessage)
    })

    server.on('upgrade', function (request, socket, head) {
        console.log('Parsing session from request...');

        sess(request, {}, () => {
            if (!request.session.clientID) {
                request.session.clientID = uuidv4()
                return;
            }

            wss.handleUpgrade(request, socket, head, function (ws) {
                wss.emit('connection', ws, request);
            });
        });
    });

    wss.on('error', console.error)

    wss.on("close", () => {
        clients.delete(ws);
    });


    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}