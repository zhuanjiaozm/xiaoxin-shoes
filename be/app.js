const fs = require('fs');
const express = require('express');
const schedule = require('node-schedule');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const moment = require('moment');
const chalk = require('chalk');
const {
    getWebData,
    getMatchData
} = require('./controllers/3')
const {
    job2
} = require('./jobs/job2')


// 定义规则
let rule = new schedule.RecurrenceRule();

var time = new Date();
let hour = time.getHours();
const min = time.getMinutes();

const timeArr = [1, 2, 3, 4, 5, 6, 7, 8];
const hourRule = timeArr.map(item => {
    return (item * 3 + hour > 23) ? (item * 3 + hour - 24) : (item * 3 + hour);
});


rule.second = 0;
rule.minute = min + 1;
rule.hour = hourRule; // 每隔6小时执行
// rule.second = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]; // 每隔1秒执行

// 启动任务
schedule.scheduleJob(rule, () => {
    // const time = moment(new Date().getTime()).format('YY-MM-DD HH:mm:ss');
    // console.log(chalk.greenBright('开始定时任务:', time));
    // job2();
});


// job2();


//1.导入路由模块
const router = require('./router')

const app = express()
var expressWs = require('express-ws')(app);
const port = 3001;

var whitelist = ['http://localhost:8080', 'http://fengziqiao.xyz', 'http://xx.fengziqiao.xyz', 'http://awsus.fengziqiao.xyz', undefined]
var corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        // console.log('域名:', origin);
        if (whitelist.indexOf(origin) !== -1 || origin.length > 1) {
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
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use((req, res, next) => {
    if (req.headers.authorization) {
        global.Authorization = req.headers.authorization;
    }
    next();
});

let percentage = 0;

//2.注册路由模块
app.use(router);
app.ws('/ws-UpdatePrice', function (ws, req) {
    ws.on('message', async (request) => {
        const requestData = Object.keys(request).length && JSON.parse(request);

        const allDataInWeb = await getWebData();
        ws.send(JSON.stringify({
            data: {
                step: 1,
                list: allDataInWeb,
                percentage: 25,
                msg: `总共在网站上找到${allDataInWeb.length}个商品`
            },
            success: true
        }));



        const matchData = getMatchData(requestData);
        ws.send(JSON.stringify({
            data: {
                step: 2,
                list: matchData,
                percentage: 50,
                msg: matchData && matchData.length ? `总共在网站上找到${matchData.matchList.length}个商品` : '发生了错误,没有匹配到数据'
            },
            success: matchData && matchData.length ? true : false
        }));


    });
});

app.listen(port, () => {
    const time = moment(new Date().getTime()).format('YY-MM-DD_HH:mm:ss');
    console.log(`${time} 后端服务启动成功,端口: ${port}`)
});