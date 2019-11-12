
'use strict'
const sqlite = require('sqlite-async')


module.exports = class Ticket {

	constructor(dbName = ':memory:') {
		return (async() => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS "tickets" ( "Id" INTEGER PRIMARY KEY AUTOINCREMENT, "movieName" TEXT, "userid" INTEGER, "price" INTEGER, FOREIGN KEY("userid") REFERENCES "users"("id") );'
			await this.db.run(sql)
			return this
		})()
	}


	// writes to the db.
	async addToDb(userID, movieName, price) {
		try {
			if(userID.length === 0) throw new Error('missing user id')
			if(movieName.length === 0) throw new Error('missing movieName')
			if(price.length == 0) throw new Error('missing price')
			sql = `INSERT INTO tickets(userid, movieName, price) VALUES("${userID}", "${movieName}", "${price}");`
			await this.db.run(sql)
			return true
		}

		catch(err) {
			throw err
		}
	}


	// Gets tickets for specific user.
	// Possible expansion could include a function that gets the tickets and converts it into a pretty formatted form? (perhaps for the nodemailer task?) 
	async getTickets(userID) {
		try {
			const sql = 'SELECT item FROM items WHERE list="food"'	
			db.all(sql, (err, rows) => {
			  if(err) console.error(err.message)
			  if(!err) console.log(rows) // rows is an array with all records
			})

			return rows
		}

		catch(err) {
			throw err
		}
	}
