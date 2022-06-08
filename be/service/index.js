// http_server.js
var axios = require("axios")
// 创建axios实例s
const http = axios.create({
    // baseURL: "http://127.0.0.1:8000", // api的base_url  process.env.BASE_API,,注意局域网访问时，不能使用localhost
    timeout: 20 * 1000, // 请求超时时间
    headers: {
        "accept": "application/json",
        "accept-language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
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
})


// request拦截器,拦截每一个请求加上请求头
http.interceptors.request.use(config => {
    // console.log('口令global.Authorization:', global.Authorization);
    // config.headers.post['Content-Type'] = 'application/x-www-fromurlencodeed'
    if (!global.Authorization) {
        global.Authorization = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ2ZW5kb3JUeXBlIjoxLCJkc1ZlbmRvcklkIjpudWxsLCJyb2xlIjoiVmVuZG9yQWRtaW4iLCJkc1ZlbmRvclR5cGUiOm51bGwsImRzUmVzb3VyY2VzIjoiIiwicmVzb3VyY2VzIjoiSXRlbXMsIE9yZGVycywgU3RhdGlzdGljcywgUGhvdG8gU3R1ZGlvIiwidXNlck5hbWUiOiJmYXNoaW9uZW1wb3JpbzEiLCJ3aG9sZXNhbGVySWQiOjYzNTUsImF1ZCI6IndlYiIsImdyb3VwSWRzIjpudWxsLCJndWlkIjoiQ0E3ODQzNzQtRjBDNC00Q0MzLUE1Q0YtNDc4OEI0MDY4NzYzIiwic2VjdXJpdHlVc2VySWQiOm51bGwsImlzT3JkZXJTdGF0dXNNYW5hZ2VtZW50IjpmYWxzZSwiZXhwIjoxNjU0NzgxNzg3LCJzZWN1cml0eVVzZXJSb2xlIjpudWxsfQ.A7c9qHp98cYgW553czhayM5hRiPHT3T2YvNfODw90DOXiEctRxmry0KkW_DZl4vlIqW3Vs35wUcN9LkCwDzXpQ';
    }

    global.Authorization && (config.headers['Authorization'] = global.Authorization);
    // if (store.state.token) {
    //     // console.log('token存在') // 如果token存在那么每个请求头里面全部加上token
    //     config.headers['Authorization'] = 'bearer ' + store.state.token
    // }
    return config
}, error => {
    Promise.reject(error)
})

// respone拦截器 拦截到所有的response，然后先做一些判断
http.interceptors.response.use(
    response => {
        return response
    }, error => {
        // console.log('err' + error)// for debug
        return Promise.reject(error)
    })

module.exports = http;
