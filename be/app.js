const fs = require('fs')
const express = require('express')
// const cors = require('cors')
const bodyParser = require('body-parser')


var cors = require('cors');

//1.导入路由模块
const router = require('./router')

const app = express()
const port = 3000;

var whitelist = ['http://localhost:8080', 'http://fengziqiao.xyz', 'http://xx.fengziqiao.xyz', undefined]
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

// process.on('uncaughtException', function (err) {
//     console.error(err.stack);
//     console.log("我的天啊");
// });

app.use(cors(corsOptions));
app.use(bodyParser.json())  // 解析json数据
app.use(bodyParser.urlencoded({ extended: true }));



//2.注册路由模块
app.use(router)

app.listen(port, () => {
    console.log(`后端服务启动成功,端口: ${port}`)
})
