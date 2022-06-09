const nodeXlsx = require('node-xlsx');
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const { getBasicInactiveDataByPagePromiseByAxios, getBasicActiveDataByPagePromiseByAxios, getItemByAxios, loginPromise, sendMessage } = require('../2.fashiongo/getItem');
const chalk = require('chalk');
const inventoryObj = {};
const errForGetInventory = [];


const job2 = async () => {
    const sendMessageToWeChat = async (data) => {
        await sendMessage(data).then(res => {
            return console.log(res.data.pushid);
        });
    };
    while (!global.Authorization || global.Authorization.length < 30) {
        const token = await loginPromise().then(res => {
            if (res.success) {
                console.log(chalk.green('登录成功'));
                sendMessageToWeChat({
                    title: '定时任务过程中服务端登录成功',
                    content: `成功获取到token: ${res.data}`,
                })
                return res.data;
            };
        }).catch(err => {
            console.log(chalk.red('登录发生错误err:', err));
        }).finally(() => {
            console.timeEnd('登录获取token');
        });
        global.Authorization = 'Bearer ' + token;
    }

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
            console.log(chalk.green(`总共查询了${Object.keys(allItems).length}个商品`));

            sendMessageToWeChat({
                title: '定时任务过程中获取商品列表成功',
                content: `成功获取到${Object.keys(allItems).length}个商品`,
            });

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
                        item.availableQty = i.sizes[0].availableQty;
                        inventoryObj[productId] = item;
                    });
                }

            }).catch(error => {
                errForGetInventory.push(productId);
                console.log(chalk.red(`${productId}获取库存失败`));
            }).finally(() => {
                let end_time = moment(new Date().getTime());
                console.log('');
                console.log(`第${index + 1} /${allItemsIDs.length}个${item.productName}[${productId}]查询完成,完全这个其请求耗时(秒):${end_time.diff(start_time, 'seconds')
                    }`);
                start_time = end_time;
                if (index < allItemsIDs.length - 2) {
                    index++;
                    getInventoryForItem();
                } else {
                    const time2 = moment(new Date().getTime());
                    const seconds = time2.diff(time1, "seconds");
                    console.log(`共查询${allItemsIDs.length}个商品，其中${errForGetInventory.length}个查询失败, 耗时${seconds}秒`);
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
                        console.log('库存信息文件更新成功，地址：' + file);
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