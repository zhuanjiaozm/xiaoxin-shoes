const login = require('./login');
let bearerTokenResponse = '';

module.exports = async function (itemid) {
    if (!bearerTokenResponse) {
        bearerTokenResponse = await login().then(res => {
            if (res && res.success && res.data) {
                return `Bearer ${res.data}`;
            }
        });
    }
    const response = await fetch(`https://vendoradmin.fashiongo.net/api/item/${itemid}?listKey=null`, {
        "headers": {
            "accept": "application/json",
            "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "authorization": bearerTokenResponse,
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