/*'use strict'
const sqlite = require('sqlite-async')

module.exports = class Production {
    1
    constructor(dbName = ':memory:') {
        return (async () => {
            this.db = await sqlite.open(dbName)
            const sql = 'CREATE TABLE IF NOT EXISTS "movies" ("movie" TEXT PRIMARY KEY, "date" TEXT, "time" TEXT);'
            await this.db.run(sql)
            const sql1 = 'INSERT INTO movies(movie, date, time) VALUES( "avatar", "24/04/20", "12:00");'
            await this.db.run(sql1)
            return this
        })
    }
    async prodDetails(movie) {
        try {
            const sql = `SELECT * FROM movies WHERE movie = "${movie}";`;
            const db = await this.sqlite.open(dbName);
            const data = await this.db.get(sql);
            await db.close();
            return this.data;
        }
        catch (err) {
            throw err
        }
    }




}*/