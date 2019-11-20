


const puppeteer = require('puppeteer');
const Accounts = require('../modules/index.js');

test('should move around'), async () => {
const browser = puppeteer.launch({
headless:false,
slowMo: 60,
args: ['--window-size=1920,1080']
})
}


/* potentially use this module to do a crash test on the homepage" */