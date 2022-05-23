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

app.use(cors())
app.use(bodyParser.json())  // 解析json数据
app.use(bodyParser.urlencoded({ extended: true }));


// app.js

app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});

//2.注册路由模块
app.use(router)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
