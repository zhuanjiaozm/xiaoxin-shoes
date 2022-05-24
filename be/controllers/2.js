const { getInventoryPromise, loginPromise, updatePromise } = require('../2.fashiongo/getItem');

const handleRequest = (product, getInventoryData) => {
    const { item, inventory: inventoryArray } = getInventoryData;
    let { active, productId } = item;
    const { inventory } = product;
    let inventoryV2 = inventoryArray.find(item => {
        return product.color && product.color === item.colorName;
    });


    inventoryV2 = JSON.parse(JSON.stringify(inventoryV2.sizes[0]));
    if (inventory) {
        inventoryV2.qty = inventory;
        inventoryV2.status = "In Stock";
        inventoryV2.statusCode = 1;
        inventoryV2.active = true;
        inventoryV2.available = true;
        active = true;
    } else {
        inventoryV2.qty = 0;
        inventoryV2.status = 'Out of Stock';
        inventoryV2.statusCode = 2;
        inventoryV2.active = false;
        inventoryV2.available = false;
        active = false;
    }
    return {
        "item": {
            "active": active,
            "ingredients": "",
            "howtouse": "",
            "weight": null,
            "mapDropshipProductId": null,
            "crossSellCount": null,
            "categoryId": 237,
            "parentCategoryId": 234,
            "parentParentCategoryId": -1,
            "colorCount": 5
        },
        "inventoryV2": {
            "saved": [
                {
                    "productId": productId,
                    "inventoryPrepack": [inventoryV2]
                }
            ],
            "deleted": []
        },
        "image": {
            "update": [],
            "delete": []
        },
        "crossSell": {
            "update": [],
            "delete": []
        },
        "inventory": {
            "delete": [],
            "update": [{
                "inventoryId": inventoryV2.inventoryId,
                "productId": inventoryV2.productId,
                "colorId": inventoryV2.colorId,
                "available": inventoryV2.available,
                "availableQty": inventoryV2.availableQty,
                "active": inventoryV2.active,
                "sizeName": inventoryV2.sizeName,
                "statusCode": inventoryV2.statusCode,
                "threshold": inventoryV2.threshold,
                "modifiedOn": inventoryV2.modifiedOn,
                "createdOn": inventoryV2.createdOn,
                "availableOn": inventoryV2.availableOn,
                "status": inventoryV2.status,
            }]
        },
        "video": null,
        "volumeDiscounts": {
            "saved": [],
            "deleted": []
        },
        "linkItems": [],
        "productId": "13815935",
        "mapDropshipProductId": null,
        "dsSettingInfo": [],
        "vendorSettingInfo": []
    }
}

const web2_controller = {
    getInventory: (req, res) => {
        const id = req.params.id;
        getInventoryPromise(id).then(response => {
            const data = response && response.data || {}
            res.status(200).send({
                data, success: true
            })
        })
    },
    update: (req, res) => {
        const data = req.body.data;
        const product = data[0];
        getInventoryPromise(product['id']).then(getInventoryPromiseRes => {
            const getInventoryData = getInventoryPromiseRes && getInventoryPromiseRes.success && getInventoryPromiseRes.data;
            updatePromise(handleRequest(product, getInventoryData)).then(response => {
                res.send({
                    response,
                    requestBody: handleRequest(product, getInventoryData),
                    product,
                    success: true
                })
            })
        });

        // updatePromise().then(response => {
        //     res.send({
        //         response,
        //         // requestBody: handleRequest(product, getInventoryData),
        //         product,
        //         success: true
        //     })
        // })


    },
    login: (req, res) => {
        loginPromise().then(response => {
            global.Authorization = `Bearer ${response.data}`;
            res.send(response && response.data || [])
        })
    }

};
module.exports = web2_controller;