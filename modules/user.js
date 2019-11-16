
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
			let sql = 'CREATE TABLE IF NOT EXISTS "users" ( "id" INTEGER PRIMARY KEY AUTOINCREMENT, "pass" TEXT, "user" TEXT );'
			await this.db.run(sql)
			sql = 'CREATE TABLE IF NOT EXISTS "card_details" ( "Card number" INTEGER, "Expiry Date" TEXT, "Security Code" INTEGER, "id" INTEGER, PRIMARY KEY("Card number"), FOREIGN KEY("id") REFERENCES "users"("id") );'
			await this.db.run(sql)
			return this
		})()
	}

	async register(user, pass, cNumber = null, expiry = null, secCode = null) {
		try {
			if (user.length === 0) throw new Error('missing username')
			if (pass.length === 0) throw new Error('missing password')

			//check for optional args
			if (cNumber !== null && expiry !== null && secCode !== null) {
				console.log('if statement ran')
				let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
				const data = await this.db.get(sql)
				if (data.records !== 0) throw new Error(`username "${user}" already in use`)
				pass = await bcrypt.hash(pass, saltRounds)
				sql = `INSERT INTO users(user, pass) VALUES("${user}", "${pass}");`
				await this.db.run(sql)
				sql = `SELECT * FROM users WHERE user="${user}";`
				let id = ''
				await this.db.each(sql, (err, row) => {
					if (err) console.error(err.message)
					if (!err) id = row.id
				})
				sql = `INSERT INTO card_details("Card number", "Expiry Date", "Security Code", id) VALUES("${cNumber}","${expiry}}","${secCode}","${id}")`
				await this.db.run(sql)
				return true
			} else {
				let sql = `SELECT COUNT(id) as records FROM users WHERE user="${user}";`
				const data = await this.db.get(sql)
				if (data.records !== 0) throw new Error(`username "${user}" already in use`)
				pass = await bcrypt.hash(pass, saltRounds)
				sql = `INSERT INTO users(user, pass) VALUES("${user}", "${pass}")`
				await this.db.run(sql)
				return true
			}

		} catch (err) {
			throw err
		}
	}


	async uploadPicture(pathntype, username) {
		const { path, type } = pathntype;
		const extension = mime.extension(type)
		console.log(`path: ${path}`)
		console.log(`extension: ${extension}`)
		await fs.copy(path, `public/avatars/${username}.${extension}`)
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

}
