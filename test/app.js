const nodeXlsx = require('node-xlsx');  //引用node-xlsx模块
var _ = require('lodash');
var fs = require('fs'); //文件模块
var qs = require('qs');
var path = require('path'); //系统路径模块
const puppeteer = require("puppeteer");
const { loginApi, username, password } = require('./config/fashiongo');
const itemMap = require('./config/itemMap.json');

var goods = [];
var goodsIndex = 0;
var errorList = [];
var errorListUpdate = [];






const listTable = nodeXlsx.parse("./config/list.xlsx") //读取excel表格
let list = listTable[0].data;//取出excel文件中的第一个工作表中的全部数据
const headerTabel = list[0];
headerTabel.unshift('itemID');
list.splice(0, 1); //一般来说表中的第一条数据可能是标题没有用，所以删掉
console.log('需要更新库存的信息:', list.length); //查看读取出来的数据

list.forEach((element, index) => {
    var id = itemMap[element[0]];
    if (id) {
        element.unshift(id);
        element.push(`https://vendoradmin.fashiongo.net/#/item/detail/${id}`);
        goods.push(element);
    } else {
        element.unshift('');
        errorList.push(element);
        console.log(`网站上不存在第${index + 2}个商品:${element[0]}`);
    }
});

// goods.unshift(headerTabel);
errorList.unshift(headerTabel);

var buffer = nodeXlsx.build([
    {
        name: `需要更改的数据信息${goods.length - 1}`,
        data: goods
    },
    {
        name: `需要更改的商品在第二个网上不存在的${errorList.length - 1}`,
        data: errorList
    }
]);

//写入文件
fs.appendFile(`2.第二个网站准备.xlsx`, buffer, function (err) {
    if (err) {
        console.log(err, '保存excel出错')
    } else {
        console.log('写入excel成功!!!')
    }
});

async function getToken() {
    const login = async () => {
        const response = await fetch(loginApi, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "text/plain",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://vendoradmin.fashiongo.net/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"username\":\"" + username + "\",\"password\":\"" + password + "\",\"app\":false}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        return response.json();
    };

    const bearerToken = await login().then(response => {
        // console.log('登录账号返回的body:', response);
        if (response && response.success && response.data) {
            console.log('模拟登录已经成功....');
            return response.data
        } else {
            return '发生错了'
        }
    }).catch(e => {
        console.log('登录失败了:', e);
    });

    const authorization = await `Bearer ${bearerToken}`

    return authorization;
}

async function updatePrice() {
    const currentItem = goods[goodsIndex];
    if (!currentItem) {
        console.log(`结束了${goodsIndex + 1}个`);
        return;
    }
    const itemid = currentItem[0];
    const color = currentItem[3];
    const count = currentItem[5];
    var inventoryV2;
    const bearerToken = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJ2ZW5kb3JUeXBlIjoxLCJkc1ZlbmRvcklkIjpudWxsLCJyb2xlIjoiVmVuZG9yQWRtaW4iLCJkc1ZlbmRvclR5cGUiOm51bGwsImRzUmVzb3VyY2VzIjoiIiwicmVzb3VyY2VzIjoiSXRlbXMsIE9yZGVycywgU3RhdGlzdGljcywgUGhvdG8gU3R1ZGlvIiwidXNlck5hbWUiOiJmYXNoaW9uZW1wb3JpbzEiLCJ3aG9sZXNhbGVySWQiOjYzNTUsImF1ZCI6IndlYiIsImdyb3VwSWRzIjpudWxsLCJndWlkIjoiQ0E3ODQzNzQtRjBDNC00Q0MzLUE1Q0YtNDc4OEI0MDY4NzYzIiwic2VjdXJpdHlVc2VySWQiOm51bGwsImlzT3JkZXJTdGF0dXNNYW5hZ2VtZW50IjpmYWxzZSwiZXhwIjoxNjUzMjExOTk1LCJzZWN1cml0eVVzZXJSb2xlIjpudWxsfQ.kPsqqm1_UcSa-UemZslx3sw-F_ISDtCycH_t4Todgi8iGFGXGgdzEXDudps9hM7-zbL5x1fAvcK7HcWXeBHGoA`;
    // console.log('获取token:', getToken());

    const getItem = async () => {
        const response = await fetch(`https://vendoradmin.fashiongo.net/api/item/${itemid}?listKey=null`, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": bearerToken,
                "content-type": "text/plain",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
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
    }


    const product = await getItem().then(response => {
        if (response && response.success && response.data) {
            console.log('当前是第' + goodsIndex + '个商品,第二步获取商品信息成功');
            return response.data
        } else {
            return ''
        }
    });

    const handleRequestBody = (product) => {
        // console.log(`获取到的商品对象: ${JSON.stringify(product, null, 4)}`);
        const { inventory } = product;
        let inventoryV2 = {};
        let inventoryArray = _.cloneDeepWith(inventory);

        let inventoryV2Index = 0;
        let currentInventory = {};

        inventoryArray && inventoryArray.forEach((element, index) => {
            if (element.sizes && element.colorName.includes(color)) {
                currentInventory = _.cloneDeepWith(element);
                inventoryV2 = JSON.parse(JSON.stringify(element.sizes[0]));
                inventoryV2Index = index;
            }
        });

        if (count) {
            inventoryV2.qty = count;
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

        currentInventory.sizes = [inventoryV2];
        inventoryArray[inventoryV2Index] = currentInventory;


        var active = inventoryArray.some(item => {
            return item.sizes && item.sizes[0] && item.sizes[0].active === true;
        });



        return {
            "item": {
                "active": active,
            },
            "inventoryV2": {
                "saved": [
                    {
                        "productId": itemid,
                        "inventoryPrepack": [inventoryV2]
                    }
                ],
                "deleted": []
            },
            inventory: {
                update: [{
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
            "productId": itemid,
        }
    }






    const save = async () => {
        const response = await fetch("https://vendoradmin.fashiongo.net/api/item/save", {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": bearerToken,
                "content-type": "application/json",
                "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"101\", \"Google Chrome\";v=\"101\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin"
            },
            "referrer": "https://vendoradmin.fashiongo.net/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(handleRequestBody(product)),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        return response.json();
    }
    const update = await save().then(response => {
        if (response && response.success && response.data) {
            console.log(''); console.log(''); console.log('');
            console.log(`更改第${goodsIndex + 1}/${goods.length}个商品成功:${goods[goodsIndex][1]}`);
            goodsIndex++;
            updatePrice();
        } else {
            console.log(`😭😭😭😭😭😭😭😭😭很遗憾,失败了,更改第${goodsIndex + 1}/${goods.length}个商品失败了:${goods[goodsIndex][1]}`);
            console.error(response);
            errorListUpdate.push(goods[goodsIndex]);
            goodsIndex++;
            updatePrice();
            //把data对象转换为json格式字符串
            var content = JSON.stringify({
                errorListUpdate
            });

            //指定创建目录及文件名称，__dirname为执行当前js文件的目录
            var file = path.join(__dirname, './result/2.失败记录.json');
            //写入文件
            fs.writeFile(file, content, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log('失败记录文件生成完成，地址：' + file);
            });
            return ''
        }
    });
}
updatePrice();