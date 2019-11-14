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
const fs = require('fs-extra')
const mime = require('mime-types')
//const jimp = require('jimp')

/* IMPORT CUSTOM MODULES */
const User = require('./modules/user')
const app = new Koa()
const router = new Router();
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

router.get('/support', async ctx => await ctx.render("support"))
router.get('/production', async ctx => await ctx.render("production"))


// logout button redirect to end session; add as href to all logout buttons on page
router.get('/logout', async ctx => {
	ctx.session.authorised = null
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
		//if(ctx.session.authorised !== true) return ctx.redirect('/login?msg=you need to log in')
		const data = {}
		if (ctx.query.msg) data.msg = ctx.query.msg
		console.log(ctx.session.authorised)
		await ctx.render('homePage')
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
		await user.uploadPicture(ctx.request.files.avatar, body.user);
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
		ctx.session.username = body.user
		return ctx.redirect('/?msg=you are now logged in...', body.user)
	} catch (err) {
		await ctx.render('error', { message: err.message })
	}
})

router.get('/logout', async ctx => {
	ctx.session.authorised = null
	console.log("Logged OUT")
	ctx.redirect('/?msg=you are now logged out')

})

router.get('/production', async ctx => {
	try {
		console.log("1")
		if (ctx.session.authorised !== true) {
			console.log("2")
			ctx.redirect('/login')
			//sql = 'SELECT production, dates FROM ProductionTable'
			//data = await this.db.get(sql)

		}

	} catch (err) {
		await ctx.render('login', { message: err.message })
	} // Will check if the session is open then it will direct the user
	//to production, if session isn't open it will ask the user to log in
})



// show logged in users info
router.get('/myprofile', async ctx => {
	const test = ctx.session.username
	const sql = `SELECT user FROM users WHERE user="${test}"`
	const db = await database.open(dbName)
	const name = await db.get(sql);
	let picture = `./avatars/${test}.png`
	await ctx.render('myprofile', {
		sessionActive: ctx.session.authorised,
		name: name.user,
		imgUrl: picture
	})
})

// currently broken
router.get('/Production/:movie', async ctx => {
	/*const db = await database.open(dbName)
	let sql = 'CREATE TABLE IF NOT EXISTS "movies1" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "movie" TEXT, "date" TEXT, "time" TEXT);'
	await db.run(sql)
	const sql1 = 'INSERT INTO movies1(movie, date, time) VALUES( "avatar", "24/04/20", "12:00");'
	await db.run(sql1)

	let sql2 = `SELECT * FROM movies1 WHERE movie = "${ctx.params.movie}";`;
	const data = await db.get(sql2);
	await db.close();
	console.log(data);
	*/
	const movie = new Production()
	const data = movie.prodDetails(ctx.params.movie)
	await ctx.render("Production", data)
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
module.exports = app.listen(port, async () =>
	console.log(`listening on port ${port}`)
)
