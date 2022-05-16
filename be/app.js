const puppeteer = require("puppeteer");
const { loginurl, username, password } = require('./config/fashiongo');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    await page.goto(loginurl);
    await page.type('input[type="text"]', username, { delay: 10 });
    await page.type('input[type="password"]', password, { delay: 10 });
    await page.click('input[type="checkbox"]');
    await page.screenshot({ path: 'example.png', fullPage: true });
    await page.click('.btn-login');


    const allResultsSelector = '#global-nav > ul.nav > li:nth-child(1) > ul > li:nth-child(4) > a > div';
    await page.waitForSelector(allResultsSelector);
    await page.click(allResultsSelector);


    await page.evaluate(async (body) => {
        console.log('body');
    });
})()