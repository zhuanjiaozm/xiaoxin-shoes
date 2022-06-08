// 1.导入express
const express = require('express')
const multer = require('multer')
const xlsx = require('xlsx');

const upload = multer({ storage: multer.memoryStorage() }) // 上传文件使用缓存策略
// 2.创建路由对象
const router = express.Router()

const { dataObject } = require('../data/2.fashiongo/dataObject.json');


var web2_controller = require('../controllers/2');


router.post('/login2', web2_controller.login)
router.get('/getInventory/:id', web2_controller.getInventory)
router.get('/getAllInventory', web2_controller.getAllInventory)
router.get('/getBasicActiveDataByPage', web2_controller.getBasicActiveDataByPage)

router.post('/update2', web2_controller.update)


router.get('/download2', web2_controller.download)



// router.post('/update2', (req, res) => {
//     getItem().then(response => {
//         console.log('获取商品详情:', response);
//         res.send({
//             data: response
//         })
//     })
// })

// 上传excel
router.route("/upload_excel").post(upload.any(), (req, res) => {
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
    const resultArray = {};
    result.forEach(element => {
        if (dataObject[element.styleNo]) {
            element.id = dataObject[element.styleNo]
            element.inventoryOrgin = (element.inventory === undefined) ? 10 : element.inventory;
            const invkey = element.id + '_' + element.color;

            if (resultArray[invkey]) {
                resultArray[invkey].push(element.inventoryOrgin)
            } else {
                resultArray[invkey] = [element.inventoryOrgin];
            }

            element.inventory = resultArray[invkey].reduce((total, current) => total + current, 0);



            // element.resultArray = resultArray;
            goodsList.push(element)
        } else {
            errorsList.push(element)
        }
    });


    // return res.json({
    //     errorsList, goodsList
    // })
    return res.json({
        success: true,
        data: [
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
        ]
    })
})

// 4.向外导出路由对象
module.exports = router;