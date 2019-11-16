'use strict'
const sqlite = require('sqlite-async')

module.exports = class Production {
    constructor(dbName = ':memory:') {
        return (async () => {
            this.db = await sqlite.open(dbName)
            const sql = 'CREATE TABLE IF NOT EXISTS "movies" ("movie" TEXT PRIMARY KEY, "Poster" LONGBLOB, "Details" TEXT, numberOfSeats INTEGER);'  
            const sql2 = 'CREATE TABLE IF NOT EXISTS "showingSchedule"("ShowNumber" TEXT PRIMARY KEY, "date" TEXT, "time" TEXT,"movie" TEXT, FOREIGN KEY("movie") REFERENCES "movies"("movie"));'
          //  'CREATE TABLE IF NOT EXISTS "movieDisplayRoom"("displayRoom" INTEGER PRIMARY KEY, "numberOfSeats" INTEGER,FOREIGN KEY ("ShowNumber") REFERENCES "showingSchedule"(ShowNumber));'
            await this.db.run(sql)
            await this.db.run(sql2)
            return this
        })()
    }
    async prodDetails(movie) {
        try {
            let sql = `SELECT * FROM movies WHERE movie = "${movie}";`;
			db.all(sql, (err, rows) => {
                if(err) console.error(err.message)
                if(!err) console.log(rows)       
        })   }
        catch (err) {
            throw err
        }
    }

    async showTime(movie){
        try {
            sql = `SELECT * FROM showingSchedule WHERE movie = "${movie}";`;
			db.all(sql, (err, rows) => {
                if(err) console.error(err.message)
                if(!err) console.log(rows)       
            })
        }
        catch(err){
            throw err
        }
    }
}
        
        
    



