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
//const fs = requires('fs-extra')
//const mime = require('mime-types')
//const jimp = require('jimp')

/* IMPORT CUSTOM MODULES */
const User = require('./modules/user')
const Cart = require('./modules/cart')
const cartEntry = require('./modules/cartEntry')
const help = require('./modules/help')
const app = new Koa()
const router = new Router()
const Production = require('./modules/production')
const Ticket = require('./modules/ticket')

/* CONFIGURING THE MIDDLEWARE */
app.keys = ['darkSecret']
app.use(staticDir('public'))
app.use(bodyParser())

const CONFIG = {
	rolling: true,
	renew: true
};

app.use(session(CONFIG, app))
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
		const movieTicks = await new Ticket(dbName)
		const production = await new Production(dbName)
		const db = await database.open(dbName)
		const sql = 'SELECT movie FROM movies'
		const data = await db.all(sql)
		await ctx.render('homePage', {
			sessionActive: ctx.session.authorised,
			movies: data
		})
	} catch (err) {
		ctx.body = err.message
	}
})

router.get('/booking', async ctx => await ctx.render('Bookingpage'))
router.get('/payment', async ctx => await ctx.render('payment'))
router.get('/payment_complete', async ctx => await ctx.render('payment_complete'))
router.get('/myCart', async ctx => await ctx.render('shoppingCart'))
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
	ctx.session.cart = null
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
		/* } catch (err) {
			await ctx.render('error', { message: err.message })
			//if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
			const data = {}
			if (ctx.query.msg) data.msg = ctx.query.msg
			console.log(ctx.session.authorised)
			await ctx.render('homePage') */
		// wasn't sure which version we keep
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
		if (body['card number'].length !== 0 &&
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
		ctx.session.cart = new Cart()
		return ctx.redirect('/?msg=you are now logged in...', body.user)
	} catch (err) {
		await ctx.render('error', { message: err.message })
	}
})



router.get('/tickets/:movie/:date/:time', async ctx => {
	try {
		const ticket = await new Ticket(dbName)
		//await ticket.addToDb('1', 'Avatar', '40')
		//let sql = `SELECT ShowNumber FROM showingSchedule WHERE movie LIKE "%${ctx.params.movie}%" AND date LIKE "%${ctx.params.date}%" AND time LIKE "%${ctx.params.time}%";`
		const db = await database.open(dbName)
		const data = await ticket.showNumber(ctx.params.movie, ctx.params.date, ctx.params.time)
		console.log(data)
		let sql = `SELECT low, medium, high FROM movieTicket WHERE showNumber = "${data}";`
		const data1 = await db.get(sql)
		console.log(data1)
		let totalTickets = data1.low + data1.medium + data1.high
		//console.log(ctx.params.date)
		await db.close()
		/*const low_priced = await ticket.getBands(ctx.params.movie, ctx.params.date, ctx.params.time, 'low')
		const medium_priced = await ticket.getBands(ctx.params.movie, ctx.params.date, ctx.params.time, 'medium')
		const high_priced = await ticket.getBands(ctx.params.movie, ctx.params.date, ctx.params.time, 'high') */
		await ctx.render('ticketsAvailable', { tickets: totalTickets, movie: ctx.params.movie, lowTickets: data1.low, mediumTickets: data1.medium, highTickets: data1.high, params: ctx.params, showNumber: data })

	} catch (err) {
		await ctx.render('error', { message: err.message })
	}
})

router.post('/tickets/:movie', async ctx => {
	try {
		const body = ctx.request.body
		// console.log(ctx.params.movie)
		await ctx.render('ticketsAvailable', body)
	} catch (err) {
		await ctx.render('error', { message: err.messages })
	}
})

router.post('/cart/:name/:date/:time', async ctx => {
	try {
		let x = new Cart(ctx.session.cart)
		const body = ctx.request.body
		const params = ctx.params
		console.log(body)
		console.log(params)
		let entry = new cartEntry(params, body)
		x.add(entry)
		let item = ctx.session.cart
		console.log(item.itemlist) 
		await ctx.render('shoppingCart', {item:item.itemlist})
	} catch (err) {
		await ctx.render('error', { message: err.messages })
	}
})

router.get('/quickpayment', async ctx => {
	try {
		if (ctx.session.username) {
			const user = await new User(dbName)
			let userid = await user.getId(ctx.session.username)
			let cardDetails = await user.getCard(userid)
			console.log('these are the payment details', cardDetails)
			await ctx.render('quickpayment', cardDetails)
		}
	} catch (err) {
		await ctx.render('error', { message: err.message })

	}
})

router.post('/payment/:showNumber', async ctx => {
	try {
		const tickets = await new Ticket(dbName)
		console.log(ctx.request.body)
		console.log(ctx.params)
		const body = ctx.request.body
		console.log(body)
		console.log(body.tickets[0])
		let ticketsAvailable = await tickets.ticketsAvailable(ctx.params.showNumber, body.tickets[0], body.tickets[1], body.tickets[2])
		console.log(ticketsAvailable)
		if (ticketsAvailable) {
			const numberOfTickets = body.tickets.reduce((acc, val) => acc + Number(val), 0)//the reduce function sums the number of tickets
			await ctx.render('payment', { numberOfTickets: numberOfTickets })
		}
		else {
			await ctx.render('error', { message: "too many tickets selected" })
		}
	} catch (err) {
		err.message
	}
})

router.get('/production', async ctx => { 
	try {
		const db = await database.open(dbName)
		const sql = 'SELECT movie FROM movies;'
		const data = await db.all(sql)
		console.log(data)
		await ctx.render('Production', { movies: data })
	} catch (err) {
		ctx.body = err.message
	}
})




/*
// semi complete, pushing because i wanna switch devices


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
router.post('/myprofile', async ctx => {
	const body = ctx.request.body
	const show = await new Production()
	await show.createShow(body.movie, body.date, body.time, dbName)
	await show.moviePic(ctx.request.files.avatar, body.movie)
	ctx.redirect('myprofile')
})
app.use(router.routes())

module.exports = app.listen(port, async () => console.log(`listening on port ${port}`))