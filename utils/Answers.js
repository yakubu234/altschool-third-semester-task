
module.exports = (userMessage, sessionID = null) => {
    let resp = false;
    switch (userMessage) {
        case '1':
            resp = "place an order"
            break;
        case '99':
            resp = "checkout"
            break;
        case '98':
            resp = "order history"
            break;
        case '97':
            resp = "current order"
            break;
        case '0':
            resp = "cancel"
            break;
        default:

            break;
    }

    return resp
}