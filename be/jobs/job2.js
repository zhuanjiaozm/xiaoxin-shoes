const nodeXlsx = require('node-xlsx');
const moment = require('moment');
const path = require('path');
const fs = require('fs'); //文件模块
const { getBasicInactiveDataByPagePromiseByAxios, getBasicActiveDataByPagePromiseByAxios, getItemByAxios } = require('../2.fashiongo/getItem');
const inventoryObj = {};
const errForGetInventory = [];
const job2 = async () => {
    //  获取网站商品列表
    const getProductList = () => {
        var pages1 = Array.from(Array(16), (v, k) => k + 1);
        var pages2 = Array.from(Array(25), (v, k) => k + 1);
        const promiseArray1 = pages1.map(pn => getBasicActiveDataByPagePromiseByAxios(pn));
        const promiseArray2 = pages2.map(pn => getBasicInactiveDataByPagePromiseByAxios(pn));
        const time = moment(new Date().getTime()).format('YY-MM-DD_HH:mm:ss');
        Promise.all([...promiseArray1, ...promiseArray2]).then((allArray) => {
            const allItems = {};
            allArray.forEach(items => {
                if (items) {
                    items.forEach(item => {
                        if (item.productId) {
                            allItems[item.productId] = {
                                productId: item.productId,
                                productName: item.productName,
                                active: item.active,
                                sellingPrice: item.sellingPrice,
                            };
                        } else {
                            console.error('这一页没结果');
                        }
                    });
                } else {
                    console.error('这一页没结果');
                }
            });
            console.log(`总共查询了${Object.keys(allItems).length}个商品`);
            //把data对象转换为json格式字符串
            var content = JSON.stringify({
                allItems
            });

            //指定创建目录及文件名称，__dirname为执行当前js文件的目录
            var file = path.join(__dirname, `./data2/商品数据/${time}.json`);
            //写入文件
            try {
                fs.writeFile(file, content, function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log('文件创建成功，地址：' + file);
                });
                fs.writeFile(path.join(__dirname, `./data2/allItems.json`), content, function (err) {
                    if (err) {
                        return console.log(err);
                    } else {
                        getInventory(allItems);
                    }
                });
            } catch (error) {
                console.log('写入文件失败', error);
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            console.log(`${time}读取完整商品列表完成`);
        });
    }
    const getInventory = (allItems) => {
        let index = 0;
        let start_time = moment(new Date().getTime());
        let time1 = moment(new Date().getTime());
        const allItemsIDs = Object.keys(allItems);
        const getInventoryForItem = () => {
            const productId = allItemsIDs[index];
            const item = allItems[productId];
            getItemByAxios(productId).then(res => {
                if (res.data.inventory) {
                    const inventory = res.data.inventory || [];
                    inventory.forEach(i => {
                        item.colorId = i.colorId;
                        item.colorCode = i.colorCode;
                        item.colorName = i.colorListId;
                        item.colorActive = i.sizes[0].active;
                        item.colorAvailable = i.sizes[0].available;
                        item.status = i.sizes[0].status;
                        item.statusCode = i.sizes[0].statusCode;
                        inventoryObj[productId] = item;
                    });
                }

            }).catch(error => {
                errForGetInventory.push(productId);
                console.log(error);
            }).finally(() => {
                let end_time = moment(new Date().getTime());
                console.log(`第${index + 1}/${allItemsIDs.length}个${item.productName}[${productId}]查询完成,完全这个其请求耗时(秒):${end_time.diff(start_time, 'seconds')
                    }`);
                start_time = end_time;
                console.log('');
                if (index < allItemsIDs.length - 2) {
                    index++;
                    getInventoryForItem();
                } else {
                    const time2 = moment(new Date().getTime());
                    const seconds = time2.diff(time1, "seconds");
                    console.log(`共查询${allItemsIDs.length}个商品，其中${errForGetInventory.length}个查询失败,耗时${seconds}秒`);
                    //把data对象转换为json格式字符串
                    const content = JSON.stringify({
                        inventoryObj,
                        errForGetInventory
                    });
                    const time = moment(new Date().getTime()).format('YY-MM-DD_HH:mm:ss');
                    //指定创建目录及文件名称，__dirname为执行当前js文件的目录
                    const file = path.join(__dirname, `./data2/库存数据/耗时${seconds}秒${time}.json`);
                    //写入文件
                    try {
                        fs.writeFile(file, content, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                            console.log('最终的库存文件创建成功，地址：' + file);
                        });
                        fs.writeFile(path.join(__dirname, `./data2/inventoryObj.json`), content, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                    } catch (error) {
                        console.log('写入文件失败', error);
                    }
                }
                //把data对象转换为json格式字符串
                const content = JSON.stringify({
                    inventoryObj,
                    errForGetInventory
                });
                //指定创建目录及文件名称，__dirname为执行当前js文件的目录
                const file = path.join(__dirname, `./data2/库存数据/TEMP.json`);
                //写入文件
                try {
                    fs.writeFile(file, content, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log('文件创建成功，地址：' + file);
                    });
                    fs.writeFile(path.join(__dirname, `./data2/inventoryObj.json`), content, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                } catch (error) {
                    console.log('写入文件失败', error);
                }
            });
        };
        getInventoryForItem();
    }
    getProductList();
}

module.exports = {
    job2,
};