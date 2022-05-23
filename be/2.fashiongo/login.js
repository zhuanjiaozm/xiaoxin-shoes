const fetch = require("node-fetch");
const { loginApi, username, password } = require('../conifg/2.fashiongo/fashiongo.js');

async function login(data) {
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


module.exports = login;
// export default updateInventory;