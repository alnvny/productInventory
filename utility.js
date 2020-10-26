const request = require('request');

let createProductInventory = (productIDs, productQuantity) => {
    let productInventory = {};

    if (typeof (productIDs) !== 'number' || typeof (productQuantity) !== 'number') {
        return {};
    }

    for (let i = 1; i <= productIDs; i++) {
        productInventory[i] = productQuantity;
    }
    if (productInventory) {
        return productInventory;
    }
    else {
        return {};
    }
}

let mergeDuplicateID = (products) => {
    let obj = {};

    for (let i = 0; i < products.length; i++) {
        if (obj[products[i].id]) {
            obj[products[i].id] = obj[products[i].id] + products[i].count;
        } else {
            obj[products[i].id] = products[i].count;
        }
    }
    return obj;
}

let reserveStocks = (products, productInventory) => {
    let objKeys = Object.keys(products);
    let messageArr = [];
    let messageGiveAve = [];

    for (let i = 0; i < objKeys.length; i++) {
        let id = objKeys[i];
        if (productInventory[id] > 0) {
            let consumed = productInventory[id] - products[id];
            if (consumed >= 0) {
                productInventory[id] = consumed;
                messageArr.push(`product with id: ${id} is reserved successfully`);
            }
            if (consumed < 0) {
                messageArr.push(`product with id: ${id} is reserved  ${productInventory[id]} quantity instead of requested ${products[id]}`);
                productInventory[id] = 0;
            }

        } else {
            messageGiveAve.push(`product with id: ${id} is not reserved`);

        }
    }
    return { 'messageArr': messageArr, 'messageGiveAve': messageGiveAve };
}

let createResponseMsg = (reservedObj) => {
    let obj = {};

    if (reservedObj.messageArr && reservedObj.messageArr.length > 0) {
        if (reservedObj.messageGiveAve && reservedObj.messageGiveAve.length > 0) {
            reservedObj.messageArr = reservedObj.messageArr.concat(reservedObj.messageGiveAve);
        }
        obj.success = true;
        obj.message = reservedObj.messageArr
        obj.statusCode = 200;
        // return res.status(200).json({ "success": "true", "message": reservedObj.messageArr });
        return obj
    } else {
        if (reservedObj.messageGiveAve && reservedObj.messageGiveAve.length > 0) {
            obj.success = false;
            obj.message = reservedObj.messageGiveAve;
            obj.statusCode = 404;
            //return res.status(404).json({ error: 'one of more item(s) out of stock ', "message": reservedObj.messageGiveAve });
            return obj;
        }
    }
}

let makeAPIRequest = (method, url, callback) => {
    let reqConfig = {};
    reqConfig.url = url;
    reqConfig.method = method;
    reqConfig.headers = {};
    reqConfig.headers['accept-language'] = 'en-us';

    request(reqConfig, callback);
}

module.exports = {
    createProductInventory: createProductInventory,
    mergeDuplicateID: mergeDuplicateID,
    makeAPIRequest: makeAPIRequest,
    reserveStocks: reserveStocks,
    createResponseMsg: createResponseMsg
};
