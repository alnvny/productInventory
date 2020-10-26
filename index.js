const express = require('express');
const bodyParser = require('body-parser');

const appConfig = require('./app.config.json');

const { createProductInventory, mergeDuplicateID, makeAPIRequest, reserveStocks, createResponseMsg } = require('./utility');
const { validateReqId, validateAllInStock, validateRequstBody } = require('./validation');

const app = express();

app.use(bodyParser.json());

const productIDs = appConfig.setProductIDLimit;
const productQuantity = appConfig.setProductQuantity;

let productInventoryDB = createProductInventory(productIDs, productQuantity);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && `body` in err) {
        return res.sendStatus(400); // Bad request
    }
    next();
});

app.get('/productInventory/:id', (req, res) => {
    let isIDValid = validateReqId(req.params.id);
    if (!isIDValid.success) {
        return res.status(isIDValid.statusCode).json({ error: `Bad request`, errorMessage: isIDValid.errMessage });
    }
    if (productInventoryDB[id]) {
        makeAPIRequest("GET", `${appConfig.thirdPartyUrl}/${id}`, function (error, response, body) {
            if (error) {
                return res.status(500).json({ error: `Server Error`, errorMessage: [error] });
            }
            if (response.statusCode === 200) {
                let parsedResponse = JSON.parse(response.body);
                let result = {};
                result.productId = id;
                result.productPrice = parsedResponse.price;;
                result.productCurrency = parsedResponse.currency;
                result.productInventory = productInventoryDB[id];
                return result.status(response.statusCode).json([result]);
            } else {
                return result.status(response.statusCode).json([response.statusMessage]);
            }
        });
    } else {
        return res.status(404).json({ error: `Product not found`, errorMessage: [`product with id ${id} does not exist`] });
    }

});

app.put('/productInventory', (req, res) => {
    try {
    reqProducts = req.body.product;
    let isRequestBodyValid = validateRequstBody(reqProducts);
    if (!isRequestBodyValid.success) {
        return res.status(isRequestBodyValid.statusCode).json({ error: `bad request`, message: isRequestBodyValid.errMessage });
    }

    reqProductsObj = mergeDuplicateID(reqProducts);
    if (!req.body.giveAllInStock) {
        let isAllInStock = validateAllInStock(reqProductsObj, productInventoryDB);
        if (!isAllInStock.success) {
            return res.status(isAllInStock.statusCode).json({ error: `one of more item(s) out of stock`, errorMessage: isAllInStock.errorMsg })
        }
    }
    let reservedObj = reserveStocks(reqProductsObj, productInventoryDB);
    let responseMsg = createResponseMsg(reservedObj);
    if (responseMsg.success) {
        return res.status(responseMsg.statusCode).json({ success: responseMsg.success, message: responseMsg.message });
    } else {
        return res.status(responseMsg.statusCode).json({ error: "one of more item(s) out of stock ", message: responseMsg.message });
    }
    }
    catch (error) {
        return res.status(500).json({ error: `Internal server errror`, message: [error] });
    }
});

app.listen(3001, () => console.log("server started"));