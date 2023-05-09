
const menuItems = require(__basedir + '/utils/answers.json')
const { getCache, setCache, removeCache, base64_encode, parseJson } = require('./Caching')
let resp = false;
module.exports = (userMessage, sessionID = null) => {
    userMessage = parseInt(userMessage);

    switch (true) {

        case isNaN(userMessage):
            resp = 'you are expected to enter a number'
            break;
        case userMessage == 1:
            resp = JSON.stringify(menuItems);
            break;
        case userMessage >= 20 && userMessage <= 29:
            resp = jsonParser(userMessage)
            break;
        case userMessage == 99:
            resp = "checkout"
            break;
        case userMessage == 98:
            resp = "order history"
            break;
        case userMessage == 97:
            resp = "current order"
            break;
        case userMessage == 0:
            resp = "cancel"
            break;
        default:
            resp = false
            break;
    }

    return resp

    function jsonParser(userInput) {
        const result = menuItems.find((element) => element.number === userInput);
        if (!result) return JSON.stringify(menuItems);

        try {
            setCache(base64_encode(sessionID + "_current"), result);
        } catch (error) {
            return false;
        }

        const mergedObj = [{ "comments": "select 99 to place order \n 97 to see current order" }, result]
        return JSON.stringify(mergedObj);
    }
}

