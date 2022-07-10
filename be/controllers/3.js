const EventEmitter = require('node:events');
EventEmitter.setMaxListeners(0);

const puppeteer = require('puppeteer');

const {
    getBaseInfo
} = require('./getBaseInfo');
const {
    tabMapObject,
    vendorID,
    password
} = require('./config');

const getTabData = async (pageURL) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(pageURL);
    // await page.waitForTimeout(3000);
    await page.type('#id_form_signin > div.form-inputs > div.margin.bottom20 > input', vendorID, {
        delay: 10
    });
    await page.type('#id_form_signin > div.form-inputs > div:nth-child(2) > input', password, {
        delay: 10
    });
    let loginButton = await page.$('#id_btn_signin')
    await loginButton.click();
    await page.waitForNavigation();

    const list = await page.$$eval('.product-box', productDom => {
        var dd = [];
        for (var i = 0; i < productDom.length; i++) {
            const id = $(productDom[i]).find(`input[type='checkbox']`).attr('id');
            const name = $.trim($(productDom[i]).find('.style-number').text());
            const currency = parseFloat($(productDom[i]).find('.currency').text());
            const status = $.trim($(productDom[i]).find('.item-status').text());
            const colors = [];
            $(productDom[i]).find('ul.colors li').each(function (index, element) {
                var name = $(this).find(`input[type='checkbox']`).attr('data-color-name');
                var checked = $(this).find(`input[type='checkbox']`).prop('checked');
                var id = $(this).attr('data-color-id');
                colors.push({
                    name,
                    checked,
                    id
                })
            });
            console.log(`${name}的价格是:${currency}`);
            dd.push({
                id,
                name,
                currency,
                status,
                colors
            });
        }
        // console.log(dd);
        return dd;
    });
    await page.close();
    await browser.close();
    return list;
    // console.log(list);

};

const allGoodsMap = {};

const getWebData = async () => {
    let list = await getBaseInfo();
    let countForPlan = list.reduce((c, R) => c + R.allCount, 0);
    let promiseAll = [];

    console.time("分页查询数组总花费时间是");
    console.log(list);

    await list.map(async tab => {
        const {
            status
        } = tabMapObject[tab.title];
        // const pageNumberArray = [1];
        const pageNumberArray = Array.from(Array(tab.maxPageNumber)).map((item, index) => index + 1);
        pageNumberArray.map(page_number => {
            const pageURL = `https://brand.orangeshine.com/products/list/?category_id=&status=${status}&filter=all&show_brand_only=False&sort_type=newest&page_size=400&page_number=${page_number}&search_field=style_num&search_text=&redirect_url=%2Fproducts%2Flist%2F`;
            promiseAll.push(getTabData(pageURL));
        });
    });

    const allDataInWeb = await Promise.all(promiseAll).then(values => {
        const allDataInWeb = values.flat();
        console.timeEnd("分页查询数组总花费时间是");
        allDataInWeb.map(good => {
            var name = good.name.toUpperCase();
            allGoodsMap[name] = {
                id: good.id,
                name,
                currency: good.currency
            }
        });
        console.log(`实际找到${allDataInWeb.length}个商品,与原计划的${countForPlan}个${allDataInWeb.length===countForPlan?'保持一致😄😄😄':'居然不一样😭😭😭'}`);
        return allDataInWeb;
    });

    return allDataInWeb;

}

handlePromise = async () => {
    let getValue = await getWebData(); // 异步获取 Promise  抛出的状态值
    return getValue;
};

handleGetMatchData = (requestData) => {
    const {
        allDataToUpdatePrice,
        webIndex
    } = requestData;
    const errorList = [];
    const matchList = [];

    if (allDataToUpdatePrice && allDataToUpdatePrice.length) {
        allDataToUpdatePrice.forEach(good => {
            var name = good['NAME'].toUpperCase();
            if (allGoodsMap[name]) {
                matchList.push({
                    id: allGoodsMap[name]['id'],
                    name: allGoodsMap[name],
                    price: good['PRICE']
                })
            } else {
                errorList.push({
                    name,
                    price: good['PRICE'],
                    msg: '商品' + name + '暂时不存在网站上'
                })
            }
        });
        return {
            errorList,
            matchList
        }
    } else {
        return [];
    }
}




module.exports = {
    getWebData: handlePromise,
    getMatchData: handleGetMatchData
}