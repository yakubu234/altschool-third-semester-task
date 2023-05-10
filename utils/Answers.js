
const menuItems = require(__basedir + '/utils/answers.json')
const { getCache, setCache, removeCache, base64_encode, parseJson } = require('./Caching')
const currentOrders = require(__basedir + '/app/models/currentOrder.model');
const order = require(__basedir + '/app/models/orders.model');
let resp = false;
module.exports = async (ws, socket, userMessage, sessionID = null) => {
    const randMessage = "Hi friend!<br><br> \n enter 1 to place an order \n<br> enter 99 to checkout order \n <br>enter 98 to see order history <br>\n enter 97 to see current order <br>\n enter 0 to cancel an order";

    userMessage = parseInt(userMessage);

    switch (true) {

        case isNaN(userMessage):
            sendWs('you are expected to enter a number')
            break;
        case userMessage == 1:
            sendWs(JSON.stringify(menuItems));
            break;
        case userMessage >= 20 && userMessage <= 29:
            checkMenu(userMessage)
            break;
        case userMessage == 99:
            checkout()
            break;
        case userMessage == 98:
            orderHistory()
            break;
        case userMessage == 97:
            currentOrder()
            break;
        case userMessage == 0:
            cancelOrder()
            break;
        default:
            sendWs(false)
            break;
    }

    function sendWs(resp) {
        if (!resp) {
            socket.send('sorry the value entered cannot be processed')
            return socket.send(randMessage)
        } else {
            return socket.send(resp)
        }
    }

    async function checkMenu(userInput) {
        const result = await menuItems.find((element) => element.number === userInput);
        if (!result) return JSON.stringify(menuItems);

        try {
            setCache(base64_encode(sessionID + "_current"), result);
        } catch (error) {
            console.log(error)
        }

        const mergedObj = [{ "comments": "select 99 to place order <br> select 97 to see current order <br>" }, result]
        return sendWs(JSON.stringify(mergedObj));
    }

    async function currentOrder() {
        await getCache(base64_encode(sessionID + "_current")).then((success) => {
            if (success) {
                result = JSON.parse(success);

                const mergedObj = [{ "comments": "Below is your current order <br> select 99 to place order <br>" }, result]
                return sendWs(JSON.stringify(mergedObj));
            } else {
                return sendWs("unnable to find any current order yet to be placed");
            }
        }).catch((err) => {
            return sendWs("unnable to find any current order yet to be placed");
        });
    }

    async function checkout() {

        await removeCache(base64_encode(sessionID + "_current")).then((success) => {

            if (success) {
                result = JSON.parse(success);
                delete result.number;

                // const newObj = {...obj, time: "2023/05/10"}; to add time to the new object
                const mergedObj = [{ "comments": "The below order has been placed  " }, result]

                order.create({
                    guest_id: sessionID + "_current",
                    current_order: JSON.stringify(result)
                }).then((success) => {

                    if (success) {
                        return sendWs(JSON.stringify(mergedObj));
                    }

                }).catch((err) => {
                    console.log(err)
                    return sendWs("unnable to find any current order yet to be placed");
                });
            } else {
                return sendWs("unnable to find any current order yet to be placed");
            }
        }).catch((err) => {
            return sendWs("unnable to find any current order yet to be placed");
        });

    }

    async function cancelOrder() {
        await removeCache(base64_encode(sessionID + "_current")).then((success) => {

            if (success) {
                result = JSON.parse(success);
                const mergedObj = [{ "comments": "The below waiting order has been canceled " }, result]
                return sendWs(JSON.stringify(mergedObj));
            } else {
                return sendWs("unnable to find any current order yet to be placed");
            }
        }).catch((err) => {
            return sendWs("unnable to find any current order yet to be placed");
        });

    }

    async function orderHistory() {
        return sendWs("order history")
    }
}


