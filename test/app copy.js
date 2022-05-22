const puppeteer = require("puppeteer");
const { loginApi, username, password } = require('./config/fashiongo');

(async () => {
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
            return ''
        }
    });
    const getActiveItems = async (pageNo, active) => {
        if (pageNo > 17) {
            return ''
        }
        const response = await fetch("https://vendoradmin.fashiongo.net/api/items?pn=" + pageNo + "&ps=180&orderBy=activatedOn&pageNo=1&pageSize=20&active=" + active, {
            "headers": {
                "accept": "application/json",
                "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
                "authorization": "Bearer " + bearerToken,
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
    };

    let total = {};
    let pageNo = 0;
    const allItems = [];
    const getItems = await getActiveItems(pageNo, true).then(response => {
        console.log(response.data.records.length);
        if (response && response.success && response.data && response.data.records) {
            total = response.data.total;
            return getActiveItems(pageNo++, true);
        } else {
            return [];
        }
    });

    // console.log(getItems);



    // const getAllActiveItems = async () => {
    //     if (pageNo < 17) {
    //         const items = await getItems(pageNo, true).the(response => {
    //             console.log(response.records.length);
    //             pageNo++;
    //             getAllActiveItems();
    //             return response.records;
    //         })
    //         allItems.push(items)
    //     }

    // }
    // getAllActiveItems();










    // console.log('activeItems:', activeItems);
})()