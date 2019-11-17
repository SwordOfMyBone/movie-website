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
const app = new Koa()
const router = new Router()
const Production = require('./modules/production')

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
const production = new Production(dbName)
router.get('/home', async ctx => {
	try {
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

router.get('/contact', async ctx => await ctx.render('Contactpage'))
router.get('/booking', async ctx => await ctx.render('Bookingpage'))
router.get('/login', async ctx => await ctx.render('login'))
router.get('/signup', async ctx => await ctx.render('SignUp'))
router.get('/support', async ctx => await ctx.render('support'))
router.get('/payment', async ctx => await ctx.render('payment'))
router.get('/production', async ctx => await ctx.render('Production'))
router.get('/payment_complete', async ctx => await ctx.render('payment_complete'))
router.get('/support', async ctx => await ctx.render('support', { sessionActive: ctx.session.authorised }))
//router.get('/production', async ctx => await ctx.render("production"))

// logout button redirect to end session; add as href to all logout buttons on page
router.get('/logout', async ctx => {
	ctx.session.authorised = null;
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
		//if (ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if (ctx.query.msg) data.msg = ctx.query.msg
		console.log(ctx.session.authorised)
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
		return ctx.redirect('/?msg=you are now logged in...', body.user)
	} catch (err) {
		await ctx.render('error', { message: err.message })
	}
})
router.get('/logout', async ctx => {
	ctx.session.authorised = null
	console.log('Logged OUT')
	ctx.redirect('/?msg=you are now logged out')
})

/* router.get('/ticketsavailable/:movie'), async ctx => {
	try {
		const body = ctx.request.body
		const sql = `SELECT numberOfSeats FROM showingSchedule WHERE movie LIKE ${body.movieName};`
		const db = await database.open(dbName)
		const data = await db.get(sql)
		await db.close()
		await ctx.render('ticketsAvailable', data)
	} catch(err) {
		await ctx.render('error', { message: err.message })
	}
}*/ 
// still working on the ticket availability page

router.get('/quickpayment', async ctx => {
	try {
		if(ctx.session.username) {
			console.log(ctx.session.username)
			const sql = `SELECT id FROM users WHERE user LIKE "%${ctx.session.username}%";`
			const db = await database.open(dbName)
			const Username = await db.all(sql)
			const sql2 = `SELECT "Card number", "Expiry Date", "Security Code" FROM card_details WHERE id LIKE "%${Username[0].id}%";`
			const cardDetails = await db.all(sql2)
			await db.close()
			console.log('these are the payment details', cardDetails[0])
			await ctx.render('quickpayment', cardDetails[0])}
	} catch(err) {
		await ctx.render('error', {message: err.message})
	}
})

router.post('/payment', bodyParser(), async ctx => {
	try {
		console.log(ctx.request.body)
		const body = ctx.request.body
		await ctx.render('payment', body)
	} catch(err) {
	    err.message
	}})
	
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



/*
// semi complete, pushing because i wanna switch devices

		const production = await new Production(dbName)

		if (ctx.session.authorised !== true) {
			console.log('Tomato')
			ctx.redirect('/login')
			const production = await new Production(dbName)
			//sql = 'SELECT production, dates FROM ProductionTable'
			//data = await this.db.get(sql)
		} else {
			console.log(true)
			await ctx.render('Production', {
				sessionActive: ctx.session.authorised
			})
		}
	} catch (err) {
		await ctx.render('login', { message: err.message })
	} // Will check if the session is open then it will direct the user
	//to production, if session isn't open it will ask the user to log in
})

router.get('/myprofile', async ctx => {// show logged in users info
	const test = ctx.session.username
	const sql = `SELECT user FROM users WHERE user="${test}"`
	const db = await database.open(dbName)
	const name = await db.get(sql)
	const picture = `./avatars/${test}.png`
	await ctx.render('myprofile', {
		sessionActive: ctx.session.authorised,
		name: name.user, imgUrl: picture
	})
})
router.get('Prod', async ctx => {
	await ctx.render('Prod', { sessionActive: ctx.session.authorised })
})
// currently broken
router.get('/Prod/:movie', async ctx => {
	if (ctx.session.authorised) {
		const sql = `SELECT * FROM showingSchedule WHERE movie="${ctx.params.movie}";`
		const db = await database.open(dbName)
		const data = await db.all(sql)
		console.log(data)
		console.log(ctx.params.movie)
		await db.close()
		await ctx.render('Prod', { info: data, sessionActive: ctx.session.authorised })
	} else {
		return await ctx.redirect('/login')
	}
}
)
/*  // Needs fixing, typeError: cannot read property 'avatar' of undefined????
router.post('/myprofile', async ctx => {

	const { path, type } = ctx.request.files.avatar;
	const extension = mime.extension(type)
	console.log(`path: ${path}`)
	console.log(`extension: ${extension}`)
	await fs.copy(path, `public/avatars/hsharif11.${extension}`)
	ctx.redirect("myprofile")
})*/
app.use(router.routes())
module.exports = app.listen(port, async() => console.log(`listening on port ${port}`))
