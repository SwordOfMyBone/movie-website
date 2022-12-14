'use strict'

const bcrypt = require('bcrypt-promise')
const fs = require('fs-extra')
const mime = require('mime-types')
const sqlite = require('sqlite-async')
const saltRounds = 10

module.exports = class User {

	constructor(dbName = ':memory:') {
		return (async () => {
			this.db = await sqlite.open(dbName)
			// we need this table to store the user accounts
			const sql = 'CREATE TABLE IF NOT EXISTS "users" ( "id" INTEGER PRIMARY KEY AUTOINCREMENT, "pass" TEXT, "user" TEXT, "email" TEXT, "admin" BOOLEAN NOT NULL DEFAULT 0);'
			await this.db.run(sql)
			const sql2 = 'CREATE TABLE IF NOT EXISTS "card_details" ( "Card number" INTEGER, "Expiry Date" TEXT, "Security Code" INTEGER, "id" INTEGER, PRIMARY KEY("Card number"), FOREIGN KEY("id") REFERENCES "users"("id"));'
			await this.db.run(sql2)
			return this
		})()
	}

	async validateEmail(email) {
		if (email.length >= 5) {
			if (email.indexOf("@") !== 0) {
				if (email.indexOf(".") > email.indexOf("@") && email.indexOf(".") < email.length) {
					return true
				}
				else {
					throw new TypeError("INVALID EMAIL")
				}
			}
			else {
				throw new TypeError("email should contain a @ after the first character")
			}
		}
		else {
			throw new RangeError("Email should be longer than 5 characters")
		}
	}

	async register(user, pass, email, cNumber = null, expiry = null, secCode = null) {
		try {
			if (email.length >= 5) {
				if (email.indexOf("@") != 0) {
					if (email.indexOf(".") > email.indexOf("@") && email.indexOf(".") < email.length) {
						if (user.length === 0) throw new Error('missing username')
						if (pass.length === 0) throw new Error('missing password')
						if (cNumber !== null && expiry !== null && secCode !== null) {//check for optional args
							console.log('if statement ran')
							let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
							const data = await this.db.get(sql)
							if (data.records !== 0) throw new Error(`username "${user}" already in use`)
							pass = await bcrypt.hash(pass, saltRounds)

							sql = `INSERT INTO users(user, pass, email) VALUES("${user}", "${pass}", "${email}");`
							await this.db.run(sql)
							sql = `SELECT * FROM users WHERE user="${user}";`
							let id = ''
							await this.db.each(sql, (err, row) => {
								if (err) console.error(err.message)
								if (!err) id = row.id
							})
							sql = `INSERT INTO card_details("Card number", "Expiry Date", "Security Code", id) VALUES("${cNumber}","${expiry}","${secCode}","${id}")`
							await this.db.run(sql)
							return true

						} else {

							let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
							const data = await this.db.get(sql)
							if (data.records !== 0) throw new Error(`username "${user}" already in use`)
							pass = await bcrypt.hash(pass, saltRounds)
							sql = `INSERT INTO users(user, pass, email) VALUES("${user}", "${pass}", "${email}");`

							await this.db.run(sql)
							return true
						}
					}
					else {
						throw new TypeError("INVALID EMAIL")
					}
				}
				else {
					throw new TypeError("email should contain a @ after the first character")
				}
			}
			else {
				throw new RangeError("Email should be longer than 5 characters")
			}

		} catch (err) {
			throw err
		}
	}


	async uploadPicture(pathntype, username) {
		const { path, type } = pathntype
		const extension = mime.extension(type)
		console.log(`path: ${path}`)
		console.log(`extension: ${extension}`)
		await fs.copy(path, `public/avatars/${username}.${extension}`)
		return `avatars/${username}.${extension}`
	}

	async login(username, password) {
		try {
			let sql = `SELECT count(id) AS count FROM users WHERE user="${username}";`
			const records = await this.db.get(sql)
			if (!records.count) throw new Error(`username "${username}" not found`)
			sql = `SELECT pass FROM users WHERE user = "${username}";`
			const record = await this.db.get(sql)
			const valid = await bcrypt.compare(password, record.pass)
			if (valid === false) throw new Error(`invalid password for account "${username}"`)
			return true
		} catch (err) {
			throw err
		}
	}

	async isAdmin(username, dbName) {
		try {
			let sql = `SELECT admin FROM users WHERE user = "${username}";`
			const db = await sqlite.open(dbName)
			let data = await db.get(sql)
			if (data.admin == 0) {
				return data = false;
			}
			return data = true;
		}
		catch (err) {
			throw err
		}
	}

	async getId(username) {
		try {
			let sql = `SELECT id FROM users WHERE user = "${username}";`
			let id = {}
			await this.db.each(sql, (err, rows) => {
				if (err) {
					throw err
				}
				if (!err) {
					id = rows.id
				}
			})
			return id
		}
		catch (err) {
			throw err
		}

	}

	async getCard(id) {
		try {
			let sql = `SELECT "Card number", "Expiry Date", "Security Code" FROM card_details WHERE id = "${id}";`
			let cardDetails = {}
			await this.db.each(sql, (err, rows) => {
				if (err) {
					throw err
				}
				if (!err) {
					cardDetails = rows
				}
			})
			return cardDetails
		}
		catch (err) {
			throw err
		}
	}

	async movieIncome() {
		try {
			const sql = `SELECT movie, time, totalIncome FROM management;`
			const data = await this.db.all(sql)
			return data
		}
		catch (err) {
			throw err
		}
	}

	async getEmail(username) {
		try {
			const sql = `SELECT email FROM users WHERE user = "${username}";`
			const data = await this.db.get(sql)
			return data
		}
		catch (err) {
			throw err
		}
	}
}
