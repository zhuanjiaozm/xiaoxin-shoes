const { getInventoryPromise, loginPromise, updatePromise, getBasicActiveDataByPagePromise, getBasicInactiveDataByPagePromise, getItem } = require('../2.fashiongo/getItem');
const xlsx = require('xlsx');
const nodeXlsx = require('node-xlsx')
const path = require('path');
const fs = require('fs'); //文件模块
const { Worker, workerData } = require("worker_threads");
const moment = require('moment');
const { dataObject } = require('../data/2.fashiongo/dataObject.json');
let idsIndex = 0;

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
    let { productId, categoryId, parentCategoryId, parentParentCategoryId, ingredients, howtouse, weight, mapDropshipProductId, crossSellCount } = item;
    const { inventory } = product;
    let inventoryV2 = inventoryArray.find(item => {
        return product.color && product.color === item.colorName;
    });
    let active = inventoryArray.some((item, index) => {
        console.log(`------第${index}个[${product.id}]active是${item.sizes[0].active}`);
        return item.sizes && item.sizes[0] && item.sizes[0].active === true;
    });

    console.log(`--[${productId}]本来的active: ${active}`);

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
    console.log(`--[${productId}]处理后的active: ${active}`);
    return {
        "item": {
            "active": active,
            "ingredients": ingredients,
            "howtouse": howtouse,
            "weight": weight,
            "mapDropshipProductId": mapDropshipProductId,
            "crossSellCount": crossSellCount,
            "categoryId": categoryId,
            "parentCategoryId": parentCategoryId,
            "parentParentCategoryId": parentParentCategoryId,
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
        "productId": productId,
        "mapDropshipProductId": null,
        "dsSettingInfo": [],
        "vendorSettingInfo": []
    }
}





const handleData = async (req, res) => {
    var pages1 = Array.from(Array(16), (v, k) => k + 1);
    var pages2 = Array.from(Array(25), (v, k) => k + 1);
    const promiseArray1 = await pages1.map(pn => {
        const p = getBasicActiveDataByPagePromise(pn).then(response => {
            if (response && response.data && response.data.records) {
                return response.data.records.map(item => {
                    const { active, productId, productName, sellingPrice } = item;
                    return {
                        active, productId, productName, sellingPrice
                    }
                });
            }

        }).catch(err => {
            console.log('分页获取激活的商品列表发生错误: ', err);
            console.log('');
        }).finally(() => {
        });
        return p;
    });
    const promiseArray2 = await pages2.map(pn => {
        const p = getBasicInactiveDataByPagePromise(pn).then(response => {
            if (response && response.data && response.data.records) {
                return response.data.records.map(item => {
                    const { active, productId, productName, sellingPrice } = item;
                    return {
                        active, productId, productName, sellingPrice
                    }
                });
            }
        }).catch(err => {
            console.log('分页获取未激活的商品列表发生错误: ', err);
            console.log('');
        }).finally(() => {
        });
        return p;
    });
    Promise.all([...promiseArray1, ...promiseArray2]).then((values) => {
        const data = [];
        const dataObject = {};
        console.log(values);
        values.forEach(request => {
            request && request.forEach(record => {
                if (record.productId) {
                    data.push(record);
                    dataObject[record.productId] = record;
                } else {
                    console.log(`这条数据有问题:${record}`);
                }
            })
        })
        //把data对象转换为json格式字符串
        var content = JSON.stringify({ dataObject });
        //指定创建目录及文件名称，__dirname为执行当前js文件的目录
        var file = path.join(__dirname, '../data/2.fashiongo/dataObject.json');
        //写入文件
        fs.writeFile(file, content, function (err) {
            if (err) {
                return console.log(err);
            }
            console.log('文件创建成功，地址：' + file);
        });

        res.status(200).send({
            success: true,
            data
        });
    });
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

    exportExcel: (req, res) => {
        const allGoodsInventoryArrayFile = path.resolve(__dirname, '../jobs/data2/allGoodsInventoryArray.json');
        const allItemsFile = path.resolve(__dirname, '../jobs/data2/allItems.json');
        delete require.cache[allGoodsInventoryArrayFile];
        delete require.cache[allItemsFile];


        const { allItems } = require(allItemsFile);
        const { allGoodsInventoryArray } = require(allGoodsInventoryArrayFile);

        const data = [
            ['Style ID', 'Style No', 'Selling Price', 'Active']
        ];
        Object.keys(allItems).forEach((productID, index) => {
            const { productId, productName, sellingPrice, active } = allItems[productID];
            data.push([productId, productName, sellingPrice, active]);
        });


        const data2 = [
            ['Style ID', 'Style No', 'Selling Price', 'Active', 'Color Name', 'Status', 'availableQty']
        ];
        allGoodsInventoryArray.forEach((item) => {
            const { productId, productName, sellingPrice, active, colorName, status, availableQty } = item;
            data2.push([productId, productName, sellingPrice, active, colorName, status, availableQty]);
        });

        console.log('allGoodsInventoryArray.length: ', allGoodsInventoryArray.length);
        console.log('data2.length: ', data2.length);

        var buffer = nodeXlsx.build([
            {
                name: `商品列表--${data.length - 1}条数据`,
                data: data
            },
            {
                name: `库存列表--${data2.length - 1}条数据`,
                data: data2
            },
        ]);
        const fileName = path.resolve(__dirname, '../jobs/data2/allItems.xlsx');
        //写入文件
        fs.appendFile(fileName, buffer, function (err) {
            if (err) {
                console.log(err, '保存excel出错')
            } else {
                res.download(fileName, '商品和库存列表.xlsx');
                setTimeout(() => {
                    fs.unlinkSync(fileName);
                }, 3000);
            }
        });
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


    getProductList: (req, res) => {
        const allGoodsInventoryArrayFile = path.resolve(__dirname, '../jobs/data2/allGoodsInventoryArray.json');
        const allItemsFile = path.resolve(__dirname, '../jobs/data2/allItems.json');
        delete require.cache[allGoodsInventoryArrayFile];
        delete require.cache[allItemsFile];

        const { allItems } = require(allItemsFile);
        const { allGoodsInventoryArray } = require(allGoodsInventoryArrayFile);

        res.status(200).send({
            data: req.query.flag === 'false' ? allItems : allGoodsInventoryArray,
            success: true
        });
    },

    getAllInventory: async (req, res) => {
        console.time('testForEach');
        var responseData = [];
        var data = Object.keys(dataObject);
        console.log(`总共需要查询: ${data.length}个商品的库存信息`);
        var groups = [];
        for (var i = 0, len = data.length; i < len; i += 10) {
            groups.push(data.slice(i, i + 10));
        }

        console.log('总共分组:', groups.length);

        await groups.map((item, index) => {
            const worker = new Worker(__dirname + "/getInventory.js");
            worker.on("message", (result) => {
                console.log(index + '子进程返回的结果是result: ', result.length);
                responseData.push(result);
                if (responseData.length === groups.length) {
                    console.log(`处理完毕 开始返回数据: ${responseData.length}`);
                    console.timeEnd('testForEach');

                    var buffer = nodeXlsx.build([
                        {
                            name: `全部待更新的数据--${data.length}条数据`,
                            data: _.flattenDeep(responseData)
                        }
                    ]);

                    //写入文件
                    fs.appendFile(('商品库存查询结果.xlsx'), buffer, function (err) {
                        if (err) {
                            console.log(err, '保存excel出错')
                        } else {
                            console.log('更新结果的Excel文件写入成功');
                        }
                    })
                    res.status(200).send({
                        data: responseData,
                        success: true
                    })

                }
            });

            worker.on("error", (result) => {
                console.log('子进程发生了错误: ', result);
            });
            worker.postMessage(item);
        })





    },

    getBasicActiveDataByPage: (req, res) => {
        handleData(req, res);
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
                    const requestBody = getInventoryData && product && handleRequest(product, getInventoryData);
                    if (requestBody) {
                        updatePromise(requestBody).then(response => {
                            product.requestBody = requestBody;
                            if (response.success) {
                                console.log(`正在更新第${currentIndexForDataList}/${data.length}个:成功`);
                                updatedGoods.push(product);
                            } else {
                                console.log(`正在更新第${currentIndexForDataList}/${data.length}个:失败:${response.message || '发生了错误'}`);
                                product.message = response.message || '发生了错误';
                                errorList.push(product);
                            }
                        }).catch((err) => {
                            console.log(`正在更新第${currentIndexForDataList}/${data.length}个发生了错误'`);
                            console.log('更新价格时候的catch错误信息', err);
                            product.message = '更新价格发生了catch错误';
                            errorList.push(product);
                        }).finally(() => {
                            currentIndexForDataList++;
                            updatePrice();
                        });
                    } else {
                        currentIndexForDataList++;
                        updatePrice();
                    }
                }).catch((err) => {
                    product.message = '获取商品详情发生错误了哦';
                    console.log('获取详情时候的catch错误信息', err);
                    errorList.push(product);
                    currentIndexForDataList++;
                    updatePrice();
                }).finally(() => {
                    console.log(`获取商品详情完成:${product['id']}`);
                    console.log();
                });;
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
        if (global.Authorization) {
            res.send({
                success: true,
                data: global.Authorization
            })
        } else {
            loginPromise().then(response => {
                if (response.success) {
                    console.log('服务端登录成功了');
                    global.Authorization = `Bearer ${response.data}`;
                    res.send({
                        success: true,
                        data: global.Authorization
                    })
                } else {
                    console.log('登录失败');
                    res.send({
                        success: true,
                        data: ''
                    })
                }
            })
        }

    }

};

module.exports = web2_controller;