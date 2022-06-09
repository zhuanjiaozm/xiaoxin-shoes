const fs = require('fs');
const express = require('express');
const schedule = require('node-schedule');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const moment = require('moment');
const { job2 } = require('./jobs/job2')


// 定义规则
let rule = new schedule.RecurrenceRule();
rule.hour = [10, 16, 22, 4]; // 每隔6小时执行
// rule.second = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]; // 每隔1秒执行

// 启动任务
let job = schedule.scheduleJob(rule, () => {
    job2();
});


// job2();


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
app.use(compression());
app.use(bodyParser.json()); // 解析json数据
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
    if (req.headers.authorization) {
        global.Authorization = req.headers.authorization;
    }
    next();
});

//2.注册路由模块
app.use(router)

app.listen(port, () => {
    const time = moment(new Date().getTime()).format('YY-MM-DD_HH:mm:ss');
    console.log(`${time} 后端服务启动成功,端口: ${port}`)
})
