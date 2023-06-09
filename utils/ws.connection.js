
const SocketServer = require('ws').Server;
const sessions = require('express-session');
const answers = require(__basedir + '/utils/Answers.js')

module.exports = (server, sess) => {

    const wss = new SocketServer({ server })

    const sockets = {};

    function to(user, data) {

        if (sockets[user] && sockets[user].readyState === SocketServer.OPEN)
            sockets[user].send(data);
    }

    let userId;
    var webSockets = {}

    wss.on('connection', async (ws, req) => {

        sess(req, {}, () => {
            // console.log(req);
        })
        const url = req.url;
        const userId = url.substring(url.indexOf('?') + 1);
        // console.log(userId)
        const randMessage = "Hi friend!<br><br> \n enter 1 to place an order \n<br> enter 99 to checkout order \n <br>enter 98 to see order history <br>\n enter 97 to see current order <br>\n enter 0 to cancel an order";

        webSockets[userId] = ws;
        // Add listeners to the WebSocket
        ws.on('message', async (message) => {
            // console.log(userId)  but you will
            let userMessage = message.toString()
            if (userMessage === 'exit') {
                ws.send(`You have disconnected`)
                webSockets[userId].delete();
            } else {

                let response = answers(ws, webSockets[userId], userMessage.toLowerCase(), userId);

                // if (!response) {
                //     webSockets[userId].send('sorry the value entered cannot be processed')
                //     webSockets[userId].send(randMessage)
                // } else {
                //     webSockets[userId].send(response)
                // }

            }
        })

        // Static welcome message sent from server
        ws.send(randMessage)
    })

    server.on('upgrade', function (request, socket, head) {
        sess(request, {}, () => {
            if (!request.session.clientID) {
                request.session.clientID = userId
                return;
            }

            wss.handleUpgrade(request, socket, head, function (ws) {
                wss.emit('connection', ws, request);
            });
        });
    });

    wss.on('error', console.error)

    wss.on("close", () => {
        webSockets[userId].delete();
    });


    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

}
