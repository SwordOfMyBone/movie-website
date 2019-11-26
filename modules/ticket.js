
'use strict'
const sqlite = require('sqlite-async')


module.exports = class Ticket {

	constructor(dbName = ':memory:') {
		return (async () => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user  accounts
			const sql = 'CREATE TABLE IF NOT EXISTS "tickets" ( "Id" INTEGER PRIMARY KEY AUTOINCREMENT, "movieName" TEXT, "userid" INTEGER, "price" TEXT, "date" TEXT, "time" TEXT, "priceBand" TEXT, FOREIGN KEY("userid") REFERENCES "users"("id") );'
			const sql1 = 'CREATE TABLE IF NOT EXISTS "movieTicket" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "showNumber" INTEGER, "low" INTEGER, "medium" INTEGER, "high" INTEGER, FOREIGN KEY("showNumber") REFERENCES "showingSchedule"("ShowNumber"));'
			const sql2 = 'CREATE TABLE IF NOT EXISTS "management" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "movie" TEXT, "time" TEXT, "totalIncome" INTEGER DEFAULT 0, FOREIGN KEY("movie") REFERENCES "showingSchedule"("movie"), FOREIGN KEY("time") REFERENCES "showingSchedule"("time"));'
			const sql3 = `CREATE TABLE IF NOT EXISTS "pricing" ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "showNumber" INTEGER, "LP" INTEGER, "MP" INTEGER, "HP" INTEGER, FOREIGN KEY("ShowNumber") REFERENCES "showingSchedule"("ShowNumber"));`
			await this.db.run(sql3)
			await this.db.run(sql2)
			await this.db.run(sql1)
			await this.db.run(sql)
			return this
		})()
	}


	// writes to the db.
	async addToDb(userID, movieName, priceBand) {
		try {
			if (userID.length === 0) throw new Error('missing user id')
			if (movieName.length === 0) throw new Error('missing movieName')
			if (priceBand.length === 0) throw new Error('missing price')
			const sql = `INSERT INTO tickets(userid, movieName, priceBand) VALUES("${userID}", "${movieName}", "${priceBand}");`
			await this.db.run(sql)
			return true
		} catch (err) {
			throw err
		}
	}


	// Gets tickets for specific user.
	// Possible expansion could include a function that gets the tickets and converts it into a pretty formatted form? (perhaps for the nodemailer task?)
	async getTickets(userID) {
		try {
			const sql = 'SELECT item FROM items WHERE list="UserID"'
			db.all(sql, (err, rows) => {
				if (err) console.error(err.message)
				if (!err) console.log(rows) // rows is an array with all records
			})

			return rows
		} catch (err) {
			throw err
		}
	}

	async getBands(movie, date, time, specificBand) {
		try {
			const sql = `SELECT COUNT(Id) FROM tickets WHERE movieName LIKE "${movie}" AND date LIKE "${date}" AND time LIKE "${time}" AND priceBand LIKE "${specificBand}";`
			const ticketsRemaining = await this.db.get(sql)
			console.log(sql)
			console.log(ticketsRemaining)
			return ticketsRemaining['COUNT(Id)']
		} catch (err) {
			throw err
		}
	}

	async showNumber(movie, date, time) {
		try {
			const sql = `SELECT ShowNumber FROM showingSchedule WHERE movie LIKE "%${movie}%" AND date LIKE "%${date}%" AND time LIKE "%${time}%";`
			const data = await this.db.get(sql)
			return data.ShowNumber
		}
		catch (err) {

		}
	}

	async ticketsAvailable(showNumber, low, medium, high) {
		try {

			const sql = `SELECT low, medium, high FROM movieTicket WHERE showNumber = "${showNumber}";`
			const data = await this.db.get(sql)
			console.log(data)
			if ((data.low >= low) && (data.medium >= medium) && (data.high >= high)) {
				return true
			}
			console.log("you have chosen too many tickets")
			return false
		}
		catch (err) {
			throw err
		}
	}

	async totalCost(ShowNumber, low, medium, high) {
		try {
			const sql = `SELECT LP, MP, HP FROM pricing WHERE ShowNumber = "${ShowNumber}";`
			const data = await this.db.get(sql)
			return ((low * data.LP) + (medium * data.MP) + (high * data.HP))

		}
		catch (err) {
			throw err
		}
	}

	async pricePerTicket(ShowNumber) {
		try {
			const sql = `SELECT LP, MP, HP FROM pricing WHERE ShowNumber = "${ShowNumber}";`
			const data = await this.db.get(sql)
			return data
		}
		catch (err) {
			throw err
		}
	}

	async ticketsSold(movie, time, total) {
		try {
			const sql = `UPDATE management SET totalIncome = totalIncome + "${total}" WHERE movie ="${movie}" AND time = "${time}";`
			await this.db.run(sql)

		}
		catch (err) {
			throw err
		}
	}

	async removalTickets(movie, time, low, medium, high) {
		try {
			let sql = `SELECT ShowNumber FROM showingSchedule WHERE movie = "${movie}" AND time = "${time}";`
			const data = await this.db.get(sql)
			sql = `UPDATE movieTicket SET low = low - "${low}", medium = medium - "${medium}", high = high - "${high}" WHERE showNumber = "${data.ShowNumber}";`
			await this.db.run(sql)

		}
		catch (err) {
			throw err
		}
	}
}
