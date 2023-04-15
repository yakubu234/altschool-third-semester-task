'use strict'

let uuid = new DeviceUUID().get();
if (getLocalStorage() != null) uuid = atob(getLocalStorage())

setLocalStorage(btoa(uuid))
setSessionStorage(btoa(uuid))

window.onload = function () {  //calling the init route to store the session
    console.log(uuid)
    $.ajax({
        type: 'POST',
        url: "/uuid",
        async: false,
        data: { uuid: uuid },
        success: function () {
            console.log('session initialized');
        },
        error: function (e) {
            console.log(e)
            console.log('error');
        }
    })

}

function setLocalStorage(uuid) {
    return localStorage.setItem("buka-app-token", JSON.stringify(uuid));
}

function getLocalStorage() {
    const data = localStorage.getItem("buka-app-token");
    return JSON.parse(data)
}


function setSessionStorage(uuid) {
    return sessionStorage.setItem("buka_app_token", JSON.stringify(uuid));
}

var ws;
const host = location.origin.replace(/^http/, 'ws')
setTimeout(function () {

    var load = document.getElementById('load');
    try {
        ws = new WebSocket(host + '?' + uuid)

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

