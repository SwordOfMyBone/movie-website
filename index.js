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
const fetch = require('node-fetch')

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
		console.log(data.length)
		for (let i = 0; i < data.length; i++) {
			const fetc = await fetch(`http://www.omdbapi.com/?apikey=45e57b54&t=${data[i].movie}`, { mode: 'cors' });
			const response = await fetc.json();
			data[i].plot = response.Plot;
			console.log(data[i].plot);
		}
		console.log("test")
		await ctx.render('homePage', {
			sessionActive: ctx.session.authorised,
			movies: data
		})
	} catch (err) {
		ctx.body = err.message
	}
})

router.get('/myCart', async ctx => await ctx.render('shoppingCart', { cart: ctx.session.cart }))

router.get('/paymentcart', async ctx => {
	try {
		const tickets = await new Ticket(dbName)
		let total = await tickets.cartTotal(ctx.session.cart)
		await ctx.render('paymentcart', { cart: ctx.session.cart, total: total })
	}
	catch (err) {
		throw err
	}
})

router.post('/payment_complete', async ctx => {
	const tickets = await new Ticket(dbName)
	const body = ctx.request.body
	if (ctx.session.cart === undefined || ctx.session.cart.length == 0) {
		await tickets.ticketsSold(body.movie, body.time, body.total)
		await tickets.removalTickets(body.movie, body.time, body.low, body.medium, body.high)
		await tickets.createPdf(ctx.session.username, body.movie, body.time, body.total, body.low, body.medium, body.high)
		await tickets.emailing(ctx.session.username, ctx.session.email)
	}
	else {
		let total = await tickets.cartTotal(ctx.session.cart)
		await tickets.cartTicketsSold(ctx.session.cart)
		await tickets.cartRemovalTickets(ctx.session.cart)
		await tickets.createPdfCart(ctx.session.username, total, ctx.session.cart)
		await tickets.emailing(ctx.session.username, ctx.session.email)
	}

	ctx.session.cart = []


	await ctx.render('payment_complete')
})

router.get('/support', async ctx => await ctx.render('support', { sessionActive: ctx.session.authorised }))

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
	ctx.session.cart = []
	ctx.session.email = null
	ctx.redirect('/home')
})

/**
 * Clears cart
 *
 * @name Clear
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */
router.get('/clearall', async ctx => {
	try {
		ctx.session.cart = []
		await ctx.redirect('/')
	}
	catch (err) {

	}
})

/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 * @authentication This route requires cookie-based authentication.
 */

//Redirects to home
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
		if (body['card number'].length !== 0 &&
			body.expiry.length !== 0 &&
			body['security code'].length !== 0
		) {
			await user.register(body.user, body.pass, body.email, body['card number'], body.expiry, body['security code'])
		} else {
			await user.register(body.user, body.pass, body.email)
		}
		console.log(ctx.request.files.avatar)
		let picPath = await user.uploadPicture(ctx.request.files.avatar, body.user)
		ctx.session.picPath = picPath
		ctx.redirect(`/?msg=new user "${body.name}" added`) // redirect to the home page
	} catch (err) {
		await ctx.render('error', { message: err.message })
	}
})

/**
 * The secure login page
 *
 * @name Login Page
 * @route {GET} /
 */

router.get('/login', async ctx => {
	const data = {}
	if (ctx.query.msg) data.msg = ctx.query.msg
	if (ctx.query.user) data.user = ctx.query.user
	await ctx.render('login', data)
})


/**
 * The secure login.
 *
 * @name Page
 * @route {POST} /
 * @authentication This route requires cookie-based authentication.
 */
router.post('/login', async ctx => {
	try {
		const body = ctx.request.body
		const user = await new User(dbName)
		await user.login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.username = body.user
		const data = await user.getEmail(body.user)
		ctx.session.email = data.email
		ctx.session.cart = []

		return ctx.redirect('/?msg=you are now logged in...', body.user)
	} catch (err) {
		await ctx.render('error', { message: err.message })
	}
})


/**
 * The tickets page.
 *
 * @name Tickets
 * @route {GET} /
 * 
 */
router.get('/tickets/:movie/:date/:time', async ctx => {
	try {
		const ticket = await new Ticket(dbName)
		const db = await database.open(dbName)
		const data = await ticket.showNumber(ctx.params.movie, ctx.params.date, ctx.params.time)
		console.log(data)
		let sql = `SELECT low, medium, high FROM movieTicket WHERE showNumber = "${data}";`
		const data1 = await db.get(sql)
		console.log(data1)
		let totalTickets = data1.low + data1.medium + data1.high
		await db.close()
		let tick = await ticket.pricePerTicket(data)
		await ctx.render('ticketsAvailable', { tickets: totalTickets, movie: ctx.params.movie, lowTickets: data1.low, mediumTickets: data1.medium, highTickets: data1.high, params: ctx.params, showNumber: data, LP: tick.LP, MP: tick.MP, HP: tick.HP })

	} catch (err) {
		await ctx.render('error', { message: err.message })
	}
})

router.post('/tickets/:movie', async ctx => {
	try {
		const body = ctx.request.body
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
		console.log(body.tickets[0])
		console.log(body.tickets[0])
		console.log(body.tickets[0])
		console.log(params.date)
		console.log(ctx.session.cart)
		await x.addCart(params.name, params.date, params.time, ctx.session.cart, body.tickets[0], body.tickets[1], body.tickets[2])
		console.log(ctx.session.cart)
		await ctx.render('shoppingCart', { cart: ctx.session.cart })
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
		const production = await new Production(dbName)
		console.log(ctx.request.body)
		console.log(ctx.params)
		const body = ctx.request.body
		console.log(body)
		console.log(body.tickets[0])
		const movietime = await production.movieName(ctx.params.showNumber)
		const totalCost = await tickets.totalCost(ctx.params.showNumber, body.tickets[0], body.tickets[1], body.tickets[2])

		let ticketsAvailable = await tickets.ticketsAvailable(ctx.params.showNumber, body.tickets[0], body.tickets[1], body.tickets[2])
		console.log(ticketsAvailable)

		if (ticketsAvailable) {
			//const numberOfTickets = body.tickets.reduce((acc, val) => acc + Number(val), 0)//the reduce function sums the number of tickets
			ctx.session.cart = []
			await ctx.render('payment', { low: body.tickets[0], medium: body.tickets[1], high: body.tickets[2], movie: movietime.movie, time: movietime.time, total: totalCost })
		}
		else {
			await ctx.render('error', { message: "too many tickets selected" })
		}
	} catch (err) {
		err.message
	}
})

/**
 * The My Profile page displays user info
 *
 * @name myprofile page
 * @route {GET} /myprofile
 */
router.get('/myprofile', async ctx => {// show logged in users info
	const picture = ctx.session.picPath
	console.log(picture)
	const user = await new User(dbName)
	const data = await user.isAdmin(ctx.session.username, dbName)
	const data1 = await user.movieIncome()
	console.log(data)
	console.log(data1)
	await ctx.render('myprofile', {
		sessionActive: ctx.session.authorised,
		name: ctx.session.username, imgUrl: picture, admin: data, income: data1, email: ctx.session.email
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
	const show = await new Production(dbName)
	await show.createShow(body.movie, body.date, body.time, body.low, body.medium, body.high, body.LP, body.MP, body.HP)
	await show.moviePic(ctx.request.files.avatar, body.movie)
	ctx.redirect('myprofile')
})
app.use(router.routes())

module.exports = app.listen(port, async () => console.log(`listening on port ${port}`))
