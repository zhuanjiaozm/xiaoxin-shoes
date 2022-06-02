const res = require('express/lib/response');
const http = require('../service/index');
const fs = require('fs'); //文件模块
const itemUrl = 'https://vendoradmin.fashiongo.net/api/item/11701984?listKey=2ea9901e-9dde-42bb-acf6-b8d64384896f';
const getInventoryUrl = 'https://vendoradmin.fashiongo.net/api/item/11701984?listKey=2ea9901e-9dde-42bb-acf6-b8d64384896f';
const productInfo = {
    "item": {
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
    "inventory": {
        "update": [],
        "delete": []
    },
    "image": {
        "update": [],
        "delete": []
    },
    "crossSell": {
        "update": [],
        "delete": []
    },
    "changedInfo": {
        "oldPictureGeneral": "13815935_730af8c8-ae5b-4efa-b788-ab910c06eef5.jpg",
        "newPictureGeneral": "13815935_730af8c8-ae5b-4efa-b788-ab910c06eef5.jpg",
        "oldProductName": "FL-ALICIA-34",
        "packId": 34120,
        "active": false
    },
    "inventoryV2": {
        "saved": [],
        "deleted": []
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
};
module.exports = {
    getItem: async function () {
        return await http.get(itemUrl).then(res => {
            return res.data;
        })
    },

    getInventoryPromise: async function (id) {
        const response = await fetch(`https://vendoradmin.fashiongo.net/api/item/${id}`, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": global.Authorization,
                "cache-control": "no-cache",
                "content-type": "text/plain",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://vendoradmin.fashiongo.net/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        return response.json();
    },

    updatePromise: async (product) => {
        const response = await fetch("https://vendoradmin.fashiongo.net/api/item/save", {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": global.Authorization,
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://vendoradmin.fashiongo.net/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(product),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        return response.json();
    },

    loginPromise: async function () {
        const response = await fetch("https://vendoradmin.fashiongo.net/api/login", {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "cache-control": "no-cache",
                "content-type": "text/plain",
                "pragma": "no-cache",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"102\", \"Google Chrome\";v=\"102\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://vendoradmin.fashiongo.net/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"username\":\"fashionemporio1\",\"password\":\"shoes8\",\"app\":false}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        console.log(response);
        return response.json();
    }
}