const { getInventoryPromise, loginPromise, updatePromise } = require('../2.fashiongo/getItem');
const xlsx = require('xlsx');
const nodeXlsx = require('node-xlsx')
const path = require('path');
const fs = require('fs'); //文件模块
const moment = require('moment');


const json_to_sheet = (arr) => {
    let result = [];
    arr.forEach(element => {
        let row = [];
        Object.keys(element).map(col => {
            if (Object.prototype.toString.call(element[col]) !== '[Object Object]') {
                row.push(element[col])
            }
        })
        result.push(row);
    });
    return result;
}

const handleRequest = (product, getInventoryData) => {
    const { item, inventory: inventoryArray } = getInventoryData;
    let { productId } = item;
    const { inventory } = product;
    let inventoryV2 = inventoryArray.find(item => {
        return product.color && product.color === item.colorName;
    });
    let active = inventoryArray.some((item, index) => {
        console.log(`第${index}个[${product.id}]active是${item.sizes[0].active}`);
        return item.sizes && item.sizes[0] && item.sizes[0].active === true;
    });

    console.log('本来的active:', active);

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
    console.log('处理后的active:', active);

    return {
        "item": {
            // "active": active,
            "ingredients": "",
            "howtouse": "",
            "weight": null,
            "mapDropshipProductId": null,
            "crossSellCount": null,
            "categoryId": 237,
            "parentCategoryId": 234,
            "parentParentCategoryId": -1,
            "colorCount": inventoryArray.length
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
            "update": [inventoryV2]
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
    download: (req, res) => {
        const filename = '../' + req.query.fileName;
        console.log(filename);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        // res.setHeader("Content-Disposition", "attachment; filename=" + filename);
        res.download(path.join(__dirname, filename), filename);

    },
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

        const updatedGoods = [];
        const errorList = [];
        let currentIndexForDataList = 0;

        function updatePrice() {
            const product = data[currentIndexForDataList];
            if (product) {
                getInventoryPromise(product['id']).then(getInventoryPromiseRes => {
                    const getInventoryData = getInventoryPromiseRes && getInventoryPromiseRes.success && getInventoryPromiseRes.data;
                    const requestBody = handleRequest(product, getInventoryData);
                    updatePromise(requestBody).then(response => {
                        console.log('');

                        product.requestBody = requestBody;
                        if (response.success) {
                            console.log(`正在更新第${currentIndexForDataList}/${data.length}个:成功`);
                            updatedGoods.push(product);
                        } else {
                            console.log(`正在更新第${currentIndexForDataList}/${data.length}个:失败:${response.message || '发生了错误'}`);
                            product.message = response.message || '发生了错误';
                            errorList.push(product);
                        }
                        currentIndexForDataList++;
                        updatePrice();
                    })
                });
            } else {
                console.log('');
                console.log(`更新完成${data.length}个,其中成功${updatedGoods.length}个,失败${errorList.length}个`);
                const time = moment(new Date().getTime()).format('YY-MM-DD_HH:mm:ss');
                const filename = `${time}_第2个网站数据更新结果.xlsx`;

                var buffer = nodeXlsx.build([
                    {
                        name: `全部待更新的数据--${data.length}条数据`,
                        data: json_to_sheet(data)
                    },
                    {
                        name: `更新成功--${updatedGoods.length}条数据`,
                        data: json_to_sheet(updatedGoods)
                    },
                    {
                        name: `更新失败--${errorList.length}条数据`,
                        data: json_to_sheet(errorList)
                    }
                ]);

                //写入文件
                fs.appendFile((filename), buffer, function (err) {
                    if (err) {
                        console.log(err, '保存excel出错')
                    } else {
                        console.log('更新结果的Excel文件写入成功');
                    }
                })
                res.send({
                    success: true,
                    data: {
                        filename,
                        allDataTouopdate: data,
                        updatedGoods,
                        errorList
                    }
                })

            }
        }
        updatePrice();

    },
    login: (req, res) => {
        loginPromise().then(response => {
            global.Authorization = `Bearer ${response.data}`;
            res.send(response && response.data || [])
        })
    }

};
module.exports = web2_controller;