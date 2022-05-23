// http_server.js
var axios = require("axios")
// 创建axios实例s
const http = axios.create({
    // baseURL: "http://127.0.0.1:8000", // api的base_url  process.env.BASE_API,,注意局域网访问时，不能使用localhost
    timeout: 20 * 1000, // 请求超时时间
    headers: {
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'Content-Type': 'application/json',
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        // 'Authorization': global.Authorization || 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ2ZW5kb3JUeXBlIjoxLCJkc1ZlbmRvcklkIjpudWxsLCJyb2xlIjoiVmVuZG9yQWRtaW4iLCJkc1ZlbmRvclR5cGUiOm51bGwsImRzUmVzb3VyY2VzIjoiIiwicmVzb3VyY2VzIjoiSXRlbXMsIE9yZGVycywgU3RhdGlzdGljcywgUGhvdG8gU3R1ZGlvIiwidXNlck5hbWUiOiJmYXNoaW9uZW1wb3JpbzEiLCJ3aG9sZXNhbGVySWQiOjYzNTUsImF1ZCI6IndlYiIsImdyb3VwSWRzIjpudWxsLCJndWlkIjoiQ0E3ODQzNzQtRjBDNC00Q0MzLUE1Q0YtNDc4OEI0MDY4NzYzIiwic2VjdXJpdHlVc2VySWQiOm51bGwsImlzT3JkZXJTdGF0dXNNYW5hZ2VtZW50IjpmYWxzZSwiZXhwIjoxNjUzNDA0NDkzLCJzZWN1cml0eVVzZXJSb2xlIjpudWxsfQ.excRNdxR8cSAkzMWAcZ4BoPDBBTAOqPEUKgvu9hoHvuEhJHm5PoqIwoj9BVv_idxcarKYKBpR430OVXfFeSoFw'
    },
})


// request拦截器,拦截每一个请求加上请求头
http.interceptors.request.use(config => {
    console.log('口令global.Authorization:', global.Authorization);
    // config.headers.post['Content-Type'] = 'application/x-www-fromurlencodeed'
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
        console.log('err' + error)// for debug
        return Promise.reject(error)
    })

module.exports = http;
