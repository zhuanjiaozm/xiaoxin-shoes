const fs = require('fs')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const xlsx = require('xlsx')
const nodeXlsx = require('node-xlsx')   //引用node-xlsx模块
const multer = require('multer')


const getItem = require('./2.fashiongo/getItem');

const app = express()
const port = 3000;

app.use(cors())
app.use(bodyParser.json())  // 解析json数据
app.use(bodyParser.urlencoded({ extended: true }));
const upload = multer({ storage: multer.memoryStorage() }) // 上传文件使用缓存策略


const itemMap = require('./conifg/2.fashiongo/itemMap.json');

app.get('/itemMap', (req, res) => {
    res.send(itemMap)
})

app.post('/update2', (req, res) => {
    const { data } = req.body;
    getItem(data[0].id).then(response => {
        if (response && response.success && response.data) {
            // console.log('获取商品详情:', response.data);
            res.send(response.data);
        } else {
            return '发生错了'
        }
    }).catch(e => {
        console.log('登录失败了:', e);
    });
})

// 上传excel
app.route("/upload_excel").post(upload.any(), (req, res) => {
    var goodsList = [];
    var errorsList = [];
    if (!req.files || req.files.length === 0) {
        return res.json({ text: '请选择文件上传' })
    }

    const { originalname, buffer } = req.files[0]
    if (!originalname.endsWith('xls') && !originalname.endsWith('xlsx')) {
        return res.json({ text: '请上传xls或xlsx格式的文件' })
    }
    // 解析excel文件
    const workbook = xlsx.read(buffer, { type: "buffer" })
    const sheet = workbook.Sheets[workbook.SheetNames[0]] // 选择第一个工作簿
    const result = xlsx.utils.sheet_to_json(sheet)

    result.forEach(element => {
        if (itemMap[element.styleNo]) {
            element.id = itemMap[element.styleNo]
            goodsList.push(element)
        } else {
            errorsList.push(element)
        }
    });


    // return res.json({
    //     errorsList, goodsList
    // })
    return res.json([
        {
            label: `1/2 匹配ID成功  ${goodsList.length}  条`,
            data: goodsList,
            type: 'success'
        },
        {
            label: `2/2 商品在网站中不存在的  ${errorsList.length}  条`,
            data: errorsList,
            type: 'error'
        }
    ])
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
