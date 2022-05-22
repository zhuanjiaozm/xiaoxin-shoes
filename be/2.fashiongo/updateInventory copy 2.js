const login = require('./login');

module.exports = async function (itemid) {
    let bearerTokenResponse = 'eyJhbGciOiJIUzUxMiJ9.eyJ2ZW5kb3JUeXBlIjoxLCJkc1ZlbmRvcklkIjpudWxsLCJyb2xlIjoiVmVuZG9yQWRtaW4iLCJkc1ZlbmRvclR5cGUiOm51bGwsImRzUmVzb3VyY2VzIjoiIiwicmVzb3VyY2VzIjoiSXRlbXMsIE9yZGVycywgU3RhdGlzdGljcywgUGhvdG8gU3R1ZGlvIiwidXNlck5hbWUiOiJmYXNoaW9uZW1wb3JpbzEiLCJ3aG9sZXNhbGVySWQiOjYzNTUsImF1ZCI6IndlYiIsImdyb3VwSWRzIjpudWxsLCJndWlkIjoiQ0E3ODQzNzQtRjBDNC00Q0MzLUE1Q0YtNDc4OEI0MDY4NzYzIiwic2VjdXJpdHlVc2VySWQiOm51bGwsImlzT3JkZXJTdGF0dXNNYW5hZ2VtZW50IjpmYWxzZSwiZXhwIjoxNjUzMzMzNTc4LCJzZWN1cml0eVVzZXJSb2xlIjpudWxsfQ.mTaoqCh7R_ThUvv-se9tG65G8NtnL2zvUveYXOL3toUkgNl-_QC9eqWMaBQ_qsYZPD_YVnv2Cp9nCT7O38IJpg';
    if (!bearerTokenResponse) {
        bearerTokenResponse = await login();
        console.log(bearerTokenResponse);
    }
    console.log(`Bearer ${bearerTokenResponse}`);
    const response = await fetch(`https://vendoradmin.fashiongo.net/api/item/${itemid}?listKey=null`, {
        "headers": {
            "accept": "application/json",
            "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "authorization": `Bearer ${bearerTokenResponse}`,
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