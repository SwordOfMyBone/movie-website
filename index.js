#!/usr/bin/env node
//Routes File
'use strict'
/* MODULE IMPORTS */
const Koa = require('koa')
const Router = require('koa-router')
const views = require('koa-views')
const staticDir = require('koa-static')
const bodyParser = require('koa-bodyparser')
const koaBody = require('koa-body')({ multipart: true, uploadDir: '.' })
const session = require('koa-session')
const database = require('sqlite-async')
//const fs = require('fs-extra')
//const mime = require('mime-types')
//const jimp = require('jimp')

/* IMPORT CUSTOM MODULES */
const User = require('./modules/user')
const Cart = require('./modules/shoppingCart.js')
const app = new Koa()
const router = new Router()
const Production = require('./modules/production')

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

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/home', async ctx => {
	try {
		const production = await new Production(dbName)
		const db = await database.open(dbName)
		const sql = 'SELECT movie FROM movies'
		const data = await db.all(sql)
		console.log(data)
		await ctx.render('homePage', {
			sessionActive: ctx.session.authorised,
			movies: data
		})
	} catch (err) {
		ctx.body = err.message
	}
})

router.get('/support', async ctx => await ctx.render('support', { sessionActive: ctx.session.authorised }))
//router.get('/production', async ctx => await ctx.render("production"))

/**
 * Secure logout
 *
 * @name Home Page
 * @route {GET} /logout
 * @authentication This route requires cookie-based authentication.
 */
router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.username = null
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
		await ctx.redirect('/home')
	} catch (err) {
		await ctx.render('error', { message: err.message })
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
		const body = ctx.request.body // extract the data from the request
		console.log(body)
		const user = await new User(dbName) // call the functions in the module
		if ( // Check for optional input fields, if card info is entered add it to user register params.
			body['card number'].length !== 0 &&
			body.expiry.length !== 0 &&
			body['security code'].length !== 0
		) {
			await user.register(body.user, body.pass, body['card number'], body.expiry, body['security code'])
		} else {
			await user.register(body.user, body.pass)
		}
		console.log(ctx.request.files.avatar)
		await user.uploadPicture(ctx.request.files.avatar, body.user)
		ctx.redirect(`/?msg=new user "${body.name}" added`) // redirect to the home page
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
		ctx.session.username = body.user
		ctx.session.cart = new Cart
		//console.log(ctx.session)
		return ctx.redirect('/?msg=you are now logged in...', body.user)
	} catch (err) {
		await ctx.render('error', { message: err.message })
	}
})


router.get('/production', async ctx => {
	try {
		//const production = await new Production(dbName)
		if (ctx.session.authorised !== true) {
			ctx.redirect('/login')

		} else {
			console.log(true)
			await ctx.render('Production', {
				sessionActive: ctx.session.authorised,//movies: data
			})
		}
	} catch (err) {
		await ctx.render('login', { message: err.message })
	} // Will check if the session is open then it will direct the user
	//to production, if session isn't open it will ask the user to log in
})


/**
 * The My Profile page displays user info
 *
 * @name myprofile page
 * @route {GET} /myprofile
 */
router.get('/myprofile', async ctx => {// show logged in users info
	const picture = `./avatars/${ctx.session.username}.png`
	const user = await new User()
	const data = await user.isAdmin(ctx.session.username, dbName)
	console.log(data)
	await ctx.render('myprofile', {
		sessionActive: ctx.session.authorised,
		name: ctx.session.username, imgUrl: picture, admin: data
	})
})


/**
 * The production page for a certain movie
 *
 * @name Production page
 * @route {GET} /Prod:movie
 */
router.get('/Prod/:movie', async ctx => {
	const production = await new Production()
	if (ctx.session.authorised) {
		const data = await production.prodDetails(ctx.params.movie, dbName)
		await ctx.render('Prod', { info: data, sessionActive: ctx.session.authorised })
	} else {
		return await ctx.redirect('/login')
	}
}
)


/**
 * The My profile script to change profile pictures
 *
 * @name Myprofile script
 * @route {POST} /myprofile
 */
router.post('/myprofile', koaBody, async ctx => {
	const body = ctx.request.body
	const show = await new Production()
	await show.createShow(body.movie, body.date, body.time, dbName)
	await show.moviePic(ctx.request.files.avatar, body.movie)
	ctx.redirect('myprofile')
})
app.use(router.routes())

module.exports = app.listen(port, async () => console.log(`listening on port ${port}`))
