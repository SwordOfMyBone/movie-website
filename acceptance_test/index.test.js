// eslint-disable-next-line strict
const puppeteer = require('puppeteer') //module used for acceptance testing
//const { configureToMatchImageSnapshot } = require('jest-image-snapshot')

const width = 1920 //setting the default width
const height = 1080 //setting the default height

const fs = require('fs')
const dir = './acceptance_screenshots'

if (!fs.existsSync(dir)) { 
	fs.mkdirSync(dir)
} //creates acceptance_screenshots directory if not exists

(async() => {
	const browser = await puppeteer.launch({ headless: true, args: [`--window-size=${width},${height}`] })
	const page = await browser.newPage()
	const navigationPromise = page.waitForNavigation() //helps page reloas after the navigation has finished
	await page.setViewport({ width, height })
	await page.goto('http://localhost:8080') //goes to the default homepage
	await page.screenshot({path: 'acceptance_screenshots/homepage.png'}) //screenshots the page and saves it in the acceptance_screenshots folder

	await page.goto('http://localhost:8080/home')

	await page.waitForSelector('body > .home > .contain1 > a > .contbutton1')
	await page.click('body > .home > .contain1 > a > .contbutton1') //scrolls down the homepage while no database is in use
	await page.screenshot({path: 'acceptance_screenshots/homepage_scrolled_down.png'})

	await page.waitForSelector('body > nav > ul > .navigation1 > .login')
	await page.click('body > nav > ul > .navigation1 > .login') //navigates to the login page
	await navigationPromise
	await page.screenshot({path: 'acceptance_screenshots/login.png'})

	await page.waitForSelector('body > .form2 > button > .button')
	await page.click('body > .form2 > button > .button') //back to the homepage
	await navigationPromise

	await page.waitForSelector('body > nav > ul > .navigation1 > .login')
	await page.click('body > nav > ul > .navigation1 > .login')
	await navigationPromise

	await page.waitForSelector('body > .form2 > p > button > .button')
	await page.click('body > .form2 > p > button > .button') //goes to the register page
	await page.screenshot({path: 'acceptance_screenshots/register.png'})
	await navigationPromise

	await page.waitForSelector('body > .form > p:nth-child(1) > input')
	await page.click('body > .form > p:nth-child(1) > input')

	await page.type('body > .form > p:nth-child(1) > input', 'this') //inputs data on the register page
	await page.type('body > .form > p:nth-child(2) > input', 'this')
	await page.type('body > .form > fieldset > p:nth-child(1) > input', '6789678')
	await page.type('body > .form > fieldset > p:nth-child(2) > input', '0869-07-06')
	await page.type('body > .form > fieldset > p:nth-child(3) > input', '67896')
	await page.type('body > .form > p:nth-child(4) > input', '')
	await page.waitForSelector('body > .form > p:nth-child(5) > input')
	await page.click('body > .form > p:nth-child(5) > input')
	await page.screenshot({path: 'acceptance_screenshots/register_result.png'}) //screenshots the result after registering a new user with full card details
	await navigationPromise

	await page.goto('http://localhost:8080')
	await page.waitForSelector('body > nav > ul > .navigation:nth-child(3) > .navbar')
	await page.click('body > nav > ul > .navigation:nth-child(3) > .navbar')
	await page.screenshot({path: 'acceptance_screenshots/contact.png'})
	await navigationPromise

	await browser.close() //closes Chromium and all of its pages
})()

