# productInventory

### Technology
These are the technologies used to develop the program:
* Node.js for program development
* Express for middleware implementation 
* Jasmine for unit test

### Installation
These are the prerequisite to setup the program:
* Node.js v12+
* npm v6+

Setup instructions:
(Steps with referance to Windows OS)
* Clone this repo
* cd productInventory
* execute   ``` npm install ```
* installation successful if no issues in this process

**URL** : `http://localhost:3001/productInventory:id`
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

## Error Responses

**Condition** : If product ID does not exist with provided `id` parameter.

**Code** : `404 NOT FOUND`

**Content** : `{
    "error": "Product not found",
    "errorMessage": [
        "product with id 6788 does not exist"
    ]
}`

### Or

**Condition** : If product ID is not a type of number with provided `id` parameter.

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
