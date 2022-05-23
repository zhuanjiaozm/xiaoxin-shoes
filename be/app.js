const fs = require('fs')
const express = require('express')
// const cors = require('cors')
const bodyParser = require('body-parser')


var cors = require('cors');

//1.导入路由模块
const router = require('./router')

const app = express()
const port = 3000;

var whitelist = ['http://localhost:8080', 'http://fengziqiao.xyz', 'http://xx.fengziqiao.xyz']
var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        // console.log('域名:', origin);
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions));
app.use(bodyParser.json())  // 解析json数据
app.use(bodyParser.urlencoded({ extended: true }));



//2.注册路由模块
app.use(router)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
