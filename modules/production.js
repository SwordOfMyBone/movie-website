'use strict'
const sqlite = require('sqlite-async')
const fs = require('fs-extra')
const mime = require('mime-types')
let sql = ''
let db = ''
module.exports = class Production 

{
	constructor(dbName = ':memory:') {
		return (async () => {
			this.db = await sqlite.open(dbName)
			let sql = 'CREATE TABLE IF NOT EXISTS "movies" ("movie" TEXT PRIMARY KEY, ' +
				'"Poster" LONGBLOB, "Details" TEXT, UNIQUE("movie"));'
			await this.db.run(sql)
			sql = 'CREATE TABLE IF NOT EXISTS "showingSchedule"("ShowNumber" INTEGER PRIMARY KEY AUTOINCREMENT, "date" TEXT,' +
				'"time" TEXT,"movie" TEXT, numberOfSeats INTEGER, FOREIGN KEY("movie") REFERENCES "movies"("movie"));'
			//  'CREATE TABLE IF NOT EXISTS "movieDisplayRoom"("displayRoom" INTEGER PRIMARY KEY,
			//"numberOfSeats" INTEGER,FOREIGN KEY ("ShowNumber") REFERENCES "showingSchedule"(ShowNumber));'
			await this.db.run(sql)
			return this
		})()
	}


	async prodDetails(movie, dbName) {
		try {
			const sql = `SELECT * FROM showingSchedule WHERE movie="${movie}";`
			const db = await sqlite.open(dbName)
			const data = await db.all(sql)
			console.log(data)
			await db.close()
			return data
		} catch (err) {
			throw err
		}
	}

	async showTime(movie) {
		try {
			sql = `SELECT * FROM showingSchedule WHERE movie = "${movie}";`
			db.all(sql, (err, rows) => {
				if (err) console.error(err.message)
				if (!err) console.log(rows)
			})
		} catch (err) {
			throw err
		}
	}

	async createShow(movie, date, time, dbName) {
		try {
			let sql = `INSERT INTO movies(movie) VALUES("${movie}");`
			const db = await sqlite.open(dbName)
			await db.run(sql)
			sql = `INSERT INTO showingSchedule(movie, date, time) VALUES("${movie}", "${date}", "${time}");`
			await db.run(sql)
		}
		catch (err) {
			throw err
		}
	}

	async moviePic(pathntype, movie) {
		const { path, type } = pathntype
		const extension = mime.extension(type)
		console.log(`path: ${path}`)
		console.log(`extension: ${extension}`)
		await fs.copy(path, `public/img/${movie}.${extension}`)
	}

}


