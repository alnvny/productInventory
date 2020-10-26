const { validateReqId, validateAllInStock, validateRequstBody } = require('./../validation');

describe("validate validaton functions in application", function () {
    it("validate validateReqId", function (done) {
        expect(validateReqId(undefined)).toEqual({ success: false, statusCode: 400, errMessage: `product id missing in the url` });
        expect(validateReqId(1)).toEqual({ success: true });
        expect(validateReqId('1')).toEqual({ success: false, statusCode: 400, errMessage: `product id should be a number` });
        expect(validateReqId('dsd')).toEqual({ success: false, statusCode: 400, errMessage: `product id should be a number` });
        expect(validateReqId('@##')).toEqual({ success: false, statusCode: 400, errMessage: `product id should be a number` });
        done();
    });
    it("validate validateAllInStock", function (done) {
        expect(validateAllInStock({ 1: 5, 2: 5 }, { 1: 10, 2: 10 })).toEqual({ success: true });
        expect(validateAllInStock({ 1: 10, 2: 10 }, { 1: 10, 2: 10 })).toEqual({ success: true });
        expect(validateAllInStock({ 1: 11, 2: 10 }, { 1: 10, 2: 10 })).toEqual({ success: false, statusCode: 404, errorMsg: [`product with id: 1 is not avialable as requested`] });
        expect(validateAllInStock({ 1: 11 }, { 1: 10, 2: 10 })).toEqual({ success: false, statusCode: 404, errorMsg: [`product with id: 1 is not avialable as requested`] });
        done();
    });
    it("validate validateRequstBody", function (done) {
        expect(validateRequstBody([{ "id": 1, "count": 1 }])).toEqual({ success: true });
        expect(validateRequstBody([{ "id": 22, "count": 1 }])).toEqual({ success: true });
        expect(validateRequstBody([{ "id": "A", "count": 1 }])).toEqual({ success: false, statusCode: 400,errMessage:`value should be of type numbers` });
        expect(validateRequstBody([{ "id": "", "count": 1 }])).toEqual({ success: false, statusCode: 400,errMessage:`value should be of type numbers` });
        expect(validateRequstBody([{ "id": "A!1", "count": 1 }])).toEqual({ success: false, statusCode: 400,errMessage:`value should be of type numbers` });
        expect(validateRequstBody([{ "id": 1, "count": 0 }])).toEqual({ success: false, statusCode: 400,errMessage:`count value should be a positive number` });
        expect(validateRequstBody([{ "id": '1', "count": 0 }])).toEqual({ success: false, statusCode: 400,errMessage:`value should be of type numbers` });
        done();
    });

});