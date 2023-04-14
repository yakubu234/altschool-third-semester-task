'use strict'
var ws;
const host = location.origin.replace(/^http/, 'ws')
setTimeout(function () {

    var load = document.getElementById('load');
    try {
        ws = new WebSocket(host)

        // WebSocket emit message
        ws.onmessage = (message) => displayMessage(message.data)
        ws.onerror = (error) => { console.log(error.data) }

    } catch (error) {
        // console.log(error)
    }

    load.parentNode.removeChild(load);
}, 2200);



const displayMessage = (message) => {
    if (strContains(message, 'disconnected')) {
        alert('disconnected')
    } else {
        botMessage(message)
    }
}

const strContains = (mainStr, subStr) => !!~mainStr.indexOf(subStr);

