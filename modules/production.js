'use strict'
const sqlite = require('sqlite-async')
let sql = ''
let db = ''
module.exports = class Production {
	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			let sql = 'CREATE TABLE IF NOT EXISTS "movies" ("movie" TEXT PRIMARY KEY, '+
            '"Poster" LONGBLOB, "Details" TEXT, UNIQUE("movie"));'
			await this.db.run(sql)
			sql = 'CREATE TABLE IF NOT EXISTS "showingSchedule"("ShowNumber" INTEGER PRIMARY KEY AUTOINCREMENT, "date" TEXT,'+
             '"time" TEXT,"movie" TEXT, numberOfSeats INTEGER, FOREIGN KEY("movie") REFERENCES "movies"("movie"));'
			//  'CREATE TABLE IF NOT EXISTS "movieDisplayRoom"("displayRoom" INTEGER PRIMARY KEY, 
			//"numberOfSeats" INTEGER,FOREIGN KEY ("ShowNumber") REFERENCES "showingSchedule"(ShowNumber));'
			await this.db.run(sql)

			return this
		})()
	}

	async prodDetails(movie) {
		try {
			const sql = `SELECT * FROM movies WHERE movie = "${movie}";`
			db.all(sql, (err, rows) => {
				if (err) console.error(err.message)
				if (!err) console.log(rows)
			})
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
}


