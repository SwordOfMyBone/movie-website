#!/usr/bin/env node

//Routes File

'use strict'

/* MODULE IMPORTS */

const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({multipart: true, uploadDir: '.'})
const session = require('koa-session')
//const jimp = require('jimp')

/* IMPORT CUSTOM MODULES */
const User = require('./modules/user')
const app = new Koa()
const router = new Router()

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())
app.use(session(app))
app.use(
	views(
		`${__dirname}/views`,
		{ extension: 'handlebars' },
		{ map: { handlebars: 'handlebars' } }
	)
)

const defaultPort = 8080
const port = process.env.PORT || defaultPort
const dbName = 'website.db'

router.get('/home', async ctx => {
	try {
		if (ctx.session.authorised) {
			return await ctx.render('homePage', {
				sessionActive: ctx.session.authorised
			})
		} else {
			return await ctx.render('homePage', {
				sessionActive: ctx.session.authorised
			})
		}
	} catch (err) {
		ctx.body = err.message
	}
})

router.get('/contact', async ctx => await ctx.render('Contactpage'))
router.get('/booking', async ctx => await ctx.render('Bookingpage'))
router.get('/login', async ctx => await ctx.render('login'))
router.get('/signup', async ctx => await ctx.render('SignUp'))
router.get('/support', async ctx => await ctx.render('support'))
router.get('/payment', async ctx => await ctx.render('payment'))
router.get('/production', async ctx => await ctx.render('Production'))

// logout button redirect to end session; add as href to all logout buttons on page
router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/home')
})

// just testing sessions since we dont have the DB ready yet so i cant do this with user login, when you go onto /test it automatically logs you in and removes the log in button from home page and replaces with MyProfile button
router.get('/test', ctx => {
	ctx.session.authorised = true
	ctx.redirect('/home')
})

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/', async ctx => {
	try {
		if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if(ctx.query.msg) data.msg = ctx.query.msg
		await ctx.render('index')
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */

router.post('/register', koaBody, async ctx => {
	try {
		// extract the data from the request
		const body = ctx.request.body
		console.log(body)
		// call the functions in the module
		const user = await new User(dbName)
		// Check for optional input fields, if card info is entered add it to user register params.
		if (
			body['card number'].length != 0 &&
      body.expiry.length != 0 &&
      body['security code'].length != 0
		) {
			await user.register(
				body.user,
				body.pass,
				body['card number'],
				body.expiry,
				body['security code']
			)
		} else {
			await user.register(body.user, body.pass)
		}
		// await user.uploadPicture(path, type)
		// redirect to the home page
		ctx.redirect(`/?msg=new user "${body.name}" added`)
	} catch (err) {
		await ctx.render('error', { message: err.message })
	}
})

router.get('/login', async ctx => {
	const data = {}
	if (ctx.query.msg) data.msg = ctx.query.msg
	if (ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})

router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.login(body.user, body.pass)
		ctx.session.authorised = true
		return ctx.redirect('/?msg=you are now logged in...')
	} catch (err) {
		await ctx.render('error', { message: err.message })
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.redirect('/?msg=you are now logged out')
})

router.get('/production', async ctx => {
	ctx.session.authorised = true
	ctx.redirect('/?msg=you can now select a production')
	try{
		let RetrieveData =`SELECT production, dates FROM ProductionTable`
		const production = await this.db.get(sql)
	}
	catch(err){
		await ctx.render('error',{message: err.message})
	} //should be something like this well have to test 
	//after the database has been successfuly fixed/created
})

router.get('/payment', async ctx => await ctx.render('payment'))
router.get('/payment_complete', async ctx => await ctx.render('payment_complete'))



app.use(router.routes())
module.exports = app.listen(port, async() =>
	console.log(`listening on port ${port}`)
)
