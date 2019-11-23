const cartEntry = require('./cartEntry.js')
//Helper functions for cart.js
module.exports = {}

	//handles incrementing two obj and returns a new object
module.exports.entryAdd = (entry,entry2) => {
		let qty = {}
		for(let i of Object.entries(entry.ticketQty)){
			for(let j of Object.entries(entry2.ticketQty)){
				//builds every tPriceBand : value pair 
				if(JSON.stringify(i[0]) === JSON.stringify(j[0])){
					let value = parseInt(i[1])+parseInt(j[1])
					let tType = i[0]
					qty[tType] =  value
				}
			}
		}
		let ticket = entry.ticket
		let obj = new cartEntry(ticket , qty)
		return obj
	}

//compares two cartEntry objects
module.exports.compare =  (entry, entry2) => {
	if( JSON.stringify(entry.ticket) === JSON.stringify(entry2.ticket)){
		return true
	}
	return false
}
