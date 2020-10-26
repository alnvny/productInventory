let validateReqId = (id) => {
    let obj = {};

    if (id === undefined) {
        obj.success = false;
        obj.statusCode = 400;
        obj.errMessage = `product id missing in the url`;
        return obj;
    } else if (typeof (id) !== 'number') {
        obj.success = false;
        obj.statusCode = 400;
        obj.errMessage = `product id should be a number`;
        return obj;
    }
    obj.success = true;
    return obj;
}

let validateAllInStock = (products, productInventory) => {
    let obj = {};
    let errorMsg = [];
    let objKeys = Object.keys(products);

    for (let i = 0; i < objKeys.length; i++) {
        let count = products[objKeys[i]] ? products[objKeys[i]] : 0;
        let consumed = (productInventory[objKeys[i]] ? productInventory[objKeys[i]] : 0) - count;
        if (consumed < 0) {
            errorMsg.push(`product with id: ${objKeys[i]} is not avialable as requested`);
        }
    }

    if (errorMsg.length > 0) {
        obj.success = false;
        obj.statusCode = 404;
        obj.errorMsg = errorMsg;
    } else {
        obj.success = true;
    }
    return obj;
}

let validateRequstBody = (products) => {
    let obj = {};

    for (let i = 0; i < products.length; i++) {

        if (typeof (products[i].id) !== 'number' || typeof (products[i].count) !== 'number') {
            obj.success = false;
            obj.statusCode = 400;
            obj.errMessage = `value should be of type numbers`;
            return obj;
        } else if (products[i].count <= 0) {
            obj.success = false;
            obj.statusCode = 400;
            obj.errMessage = `count value should be a positive number`;
            return obj;
        }
    }
    obj.success = true;
    return obj;
}

module.exports = {
    validateReqId: validateReqId,
    validateAllInStock: validateAllInStock,
    validateRequstBody: validateRequstBody
};
