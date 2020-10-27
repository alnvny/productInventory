# productInventory API Documentation 

## GET productInventory

**URL** : `HostURL/productInventory:id`

**URL Parameters** : `id=[integer]` where `id` is the ID of the product.

**Auth required** : NO

**Data**: `{}`

## Success Response

**Condition** : If Product exists in the collection for the requested product id.

**Code** : `200 OK`

**Content example**

```json
{
    "productId": 1,
    "productPrice": 73,
    "productCurrency": "$",
    "productInventory": 10
}
```

## Error Responses

**Condition** : If productID does not exist with provided `id` parameter.

**Code** : `404 NOT FOUND`

**Content** : `{
    "error": "Product not found",
    "errorMessage": [
        "product with id 6788 does not exist"
    ]
}`

### Or

**Condition** : If productID is not a type of number based on the provided `id` parameter.

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "error": "Bad request",
    "errorMessage": [
        "product id should be a number"
    ]
}
```
## PUT productInventory

Update the ProductInventory when a product is consumed/reserved from the inventory list

**URL** : `HostURL/productInventory`

**Method** : `PUT`

**Auth required** : No

**Permissions required** : No

**Data constraints** : The request has two property in which `product` property is mandatoy which has array of object as value. The array of objects should have atleast one pair of `id` property and `count` property.

Another peoperty `giveAllInStock` is not mandatoy which has  boolean as a value

```json
{
    "product": "[{id:${productId},count:${number of quantity}]",
    "giveAllInStock":"${boolean}"
}
```

**Data example** Product ID and number of quantity to be reserved for that ID should be sent in array of Objects  with `id` and `count` property, which will be the value for `product` property.

  `giveAllInStock` property is set true if all the available stocks are to be consumed or reserved though there isn't stocks available that is requested.

```json
{
    "product":  "[{id:8,count:8}]",
}
```
```json
{
    "product":  "[{id:8,count:8},{id:9,count:10}]",
}
```
```json
{
    "product":  "[{id:8,count:8},{id:9,count:10}]",
    "giveAllInStock": true
}
```

## Success Responses

**Condition** : Update can be performed either fully or partially for the requested stocks based on the avilablity of the stock.

**Code** : `200 OK`

**Content example** : For the request body 
```json
{
    "product":  [{"id":8,"count":8}],
}
```
posted to `http://localhost:3001/productInventory` we get the below success response if there is stock available

```json
{
    "success": true,
    "message": [
        "product with id: 8 is reserved successfully"
    ]
}
```

## Error Response

**Condition** : Update cannot be performed for the requested stocks due to the lack of stock

**Content example** : For the request body 
```json
{
    "product":  [{"id":1,"count":20}],
}
```

**Code** : `404 NOT FOUND`

**Content** : 
```json
{
    "error": "one of more item(s) out of stock",
    "errorMessage": [
        "product with id: 1 is not avialable as requested"
    ]
}
```

### Or

**Condition** : If the product propery is not available in the request body
**Content example** : For the request body 
```json
{}
```

**Code** : `400 BAD REQUEST`

**Content** : 
```json
{
    "error": "bad request",
    "message": [
        "product array is mandatory in the request"
    ]
}
```

## Notes

### `giveAllInStock` property

If multiple productIDs are requested and we dont have the stock for all the request productIDs we can accept and ignore the request based on `giveAllInStock` property 

If the `giveAllInStock` property is set `true` , we will consume all the stock that are available for the requested productIDs even though we dont have the stock requested. 

If the `giveAllInStock` property is set `false` or not set in the request body, we will not consume any resource even if we have resource for all the requested productIDs but dont have requested resource for any one of the productIDs

E.g. if Account already exits:

**Data example**

`giveAllInStock` property is set `true` for the request body where we assume `id:1` has only 10 resources to consume in the DB and  `id:2` also has 10 resources to consume in the DB but the request body had `count:15` for the `id:1` 

```json
{
"product":[{"id":1,"count":15},{"id":2,"count":10}],
"giveAllInStock":true
	
}
```

**Code** : `200 OK`

**Content example**
We have consumed or reserved 10 quantity of `id:1` instead of 15, this request was successful since we have set  `giveAllInStock:true`
```json
{
    "success": true,
    "message": [
        "product with id: 1 is reserved  10 quantity instead of requested 15",
        "product with id: 2 is reserved successfully"
    ]
}
```
**Data example**

`giveAllInStock` property is set `false` for the request body where we assume `id:1` has only 10 resources to consume or reserve in the DB and  `id:2` also has 10 resources to consume or reserve in the DB but the request body had `count:15` for the `id:1` 

```json
{
"product":[{"id":1,"count":15},{"id":2,"count":10}],
"giveAllInStock":false
	
}
```

**Code** : `404 NOT FOUND`

**Content example**
We dont consume or reserve for any resource as we have set  `giveAllInStock:false` which will be only successful if we have all the requested resource in stock.
```json
{
    "error": "one of more item(s) out of stock",
    "errorMessage": [
        "product with id: 1 is not avialable as requested"
    ]
}
```
