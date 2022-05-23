const fs = require('fs')
const express = require('express')
// const cors = require('cors')
const bodyParser = require('body-parser')
const xlsx = require('xlsx')
const nodeXlsx = require('node-xlsx')   //引用node-xlsx模块

var cors = require('cors');

//1.导入路由模块
const router = require('./router')
const getItem = require('./2.fashiongo/getItem');

const app = express()
const port = 3000;

var whitelist = ['http://localhost:8080', 'http://fengziqiao.xyz', 'https://fengziqiao.xyz']
var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
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
