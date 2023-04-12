'use strict'
var ws;
const host = location.origin.replace(/^http/, 'ws')
try {

    ws = new WebSocket(host)

    // WebSocket emit message
    ws.onmessage = (message) => displayMessage(message.data)

    ws.onerror = (error) => { console.log(error.data) }

} catch (error) {
    // console.log(error)
}


const displayMessage = (message) => {
    if (strContains(message, 'disconnected')) {
        alert('disconnected')
    } else {
        botMessage(message)
    }
}

const strContains = (mainStr, subStr) => !!~mainStr.indexOf(subStr);

