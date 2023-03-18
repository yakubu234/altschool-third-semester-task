'use strict'

const host = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(host)

// WebSocket emit message
ws.onmessage = (message) => displayMessage(message.data)

// ws.send(val)

const displayMessage = (message) => {
    console.log(message)
}