var inventory = [
    {
        "colorId": 422959,
        "colorName": "BLACK",
        "colorListId": 6,
        "sizes": [
            {
                "inventoryId": 63623186,
                "productId": 13815935,
                "colorId": 422959,
                "available": true,
                "availableQty": 1,
                "active": true,
                "sizeName": null,
                "statusCode": 1,
                "threshold": 0,
                "modifiedOn": null,
                "createdOn": null,
                "colorListId": 6,
                "colorName": "BLACK",
                "availableOn": null,
                "status": "In Stock"
            }
        ]
    },
    {
        "colorId": 422964,
        "colorName": "GREY",
        "colorListId": 24,
        "sizes": [
            {
                "inventoryId": 63623187,
                "productId": 13815935,
                "colorId": 422964,
                "available": false,
                "availableQty": 999,
                "active": false,
                "sizeName": null,
                "statusCode": 1,
                "threshold": 0,
                "modifiedOn": null,
                "createdOn": null,
                "colorListId": 24,
                "colorName": "GREY",
                "availableOn": null,
                "status": "In Stock"
            }
        ]
    },
    {
        "colorId": 422969,
        "colorName": "WHITE",
        "colorListId": 57,
        "sizes": [
            {
                "inventoryId": 63623190,
                "productId": 13815935,
                "colorId": 422969,
                "available": false,
                "availableQty": 999,
                "active": false,
                "sizeName": null,
                "statusCode": 1,
                "threshold": 0,
                "modifiedOn": null,
                "createdOn": null,
                "colorListId": 57,
                "colorName": "WHITE",
                "availableOn": null,
                "status": "In Stock"
            }
        ]
    },
    {
        "colorId": 422975,
        "colorName": "TAN",
        "colorListId": 9,
        "sizes": [
            {
                "inventoryId": 63623189,
                "productId": 13815935,
                "colorId": 422975,
                "available": false,
                "availableQty": 999,
                "active": false,
                "sizeName": null,
                "statusCode": 1,
                "threshold": 0,
                "modifiedOn": null,
                "createdOn": null,
                "colorListId": 9,
                "colorName": "TAN",
                "availableOn": null,
                "status": "In Stock"
            }
        ]
    },
    {
        "colorId": 438843,
        "colorName": "MUSTARD",
        "colorListId": 0,
        "sizes": [
            {
                "inventoryId": 63623188,
                "productId": 13815935,
                "colorId": 438843,
                "available": false,
                "availableQty": 99999,
                "active": false,
                "sizeName": null,
                "statusCode": 2,
                "threshold": 0,
                "modifiedOn": null,
                "createdOn": null,
                "colorListId": 0,
                "colorName": "MUSTARD",
                "availableOn": null,
                "status": "Out of Stock"
            }
        ]
    }
];

var a = inventory.some(item => {
    var sizes0 = item.sizes && item.sizes[0];
    console.log(sizes0.active);
    return sizes0.active === true;
});