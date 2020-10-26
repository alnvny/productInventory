const appConfig = require('./../app.config.json');

const { createProductInventory, mergeDuplicateID, makeAPIRequest, reserveStocks, createResponseMsg } = require('./../utility');

describe("validate utility functions in application", function () {
    it("validate createProductInventory", function () {
        expect(createProductInventory(2,0)).toEqual({1:0,2:0});
        expect(createProductInventory(0,0)).toEqual({});
        expect(createProductInventory(-1,-1)).toEqual({});
        expect(createProductInventory('a',-1)).toEqual({});
        expect(createProductInventory(1,1)).toEqual({1:1});
        expect(createProductInventory(1,2)).toEqual({1:2});
        expect(createProductInventory(2,1)).toEqual({1:1,2:1});
    });

    it("validate mergeDuplicateID", function (done) {
        expect(mergeDuplicateID([{"id":1,"count":0}])).toEqual({1:0});
        expect(mergeDuplicateID([{"id":1,"count":1},{"id":1,"count":1}])).toEqual({1:2});
        expect(mergeDuplicateID([{"id":1,"count":1},{"id":2,"count":1}])).toEqual({1:1,2:1});
        done();
    });

    it("validate makeAPIRequest", function (done) {
        makeAPIRequest("GET", `${appConfig.thirdPartyUrl}/10`, function (error, response, body) {
            let parsedResponse = JSON.parse(response.body)
            expect(parsedResponse).toEqual({"currency": "$","price": 28});
        });
        makeAPIRequest("GET", `${appConfig.thirdPartyUrl}/AA`, function (error, response, body) {
            let parsedResponse = JSON.parse(response.body)
            expect(parsedResponse).toEqual({"currency": "$","price": 99});
        });
        makeAPIRequest("GET", `${appConfig.thirdPartyUrl}/`, function (error, response, body) {
            expect(response.statusMessage).toEqual("Not Found");
            expect(response.statusCode).toEqual(404);
            done();
        });
    });

    it("validate reserveStocks", function () {
         expect(reserveStocks({1:1},{1:1,2:1})).toEqual({ messageArr: [`product with id: 1 is reserved successfully`], messageGiveAve: [] });
         expect(reserveStocks({1:1,2:11,1:8},{1:10,2:10})).toEqual({ messageArr: [`product with id: 1 is reserved successfully`,`product with id: 2 is reserved  10 quantity instead of requested 11`], messageGiveAve: [] });
         expect(reserveStocks({5:1},{1:10,2:10})).toEqual({ messageArr: [], messageGiveAve: [`product with id: 5 is not reserved`] });
         expect(reserveStocks({5:1,1:9},{1:10,2:10})).toEqual({ messageArr: [`product with id: 1 is reserved successfully`], messageGiveAve: [`product with id: 5 is not reserved`] });
    });

    it("validate createResponseMsg", function () {
        expect(createResponseMsg({ messageArr: [`product with id: 1 is reserved successfully`], messageGiveAve: [] })).toEqual({success:true,statusCode:200,message:[`product with id: 1 is reserved successfully`]});
        expect(createResponseMsg({ messageArr: [`product with id: 1 is reserved successfully`,`product with id: 2 is reserved  10 quantity instead of requested 11`]})).toEqual({success:true,statusCode:200,message:[`product with id: 1 is reserved successfully`,`product with id: 2 is reserved  10 quantity instead of requested 11`]});
        expect(createResponseMsg({ messageArr: [], messageGiveAve: [`product with id: 5 is not reserved`] })).toEqual({success:false,statusCode:404,message:[`product with id: 5 is not reserved`]});
        expect(createResponseMsg({ messageArr: [`product with id: 1 is reserved successfully`], messageGiveAve: [`product with id: 5 is not reserved`] })).toEqual({success:true,statusCode:200,message:[`product with id: 1 is reserved successfully`,`product with id: 5 is not reserved`]});
    });
})