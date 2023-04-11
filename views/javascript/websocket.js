'use strict'

const host = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(host)

// WebSocket emit message
ws.onmessage = (message) => displayMessage(message.data)

// ws.send(val)

const displayMessage = (message) => {
    if (strContains(message, 'disconnected')) {
        alert('disconnected')
    } else {
        botMessage(message)
    }
}

const strContains = (mainStr, subStr) => !!~mainStr.indexOf(subStr);

