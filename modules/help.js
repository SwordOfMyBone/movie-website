const cartEntry = require('./cartEntry.js')
//Helper functions for cart.js
module.exports = {}

	//handles incrementing two obj and returns a new object
module.exports.entryAdd = (entry,entry2) => {
		let qty = {tickets : []}
		ticketPrices = Object.values(entry.ticketQty)[0]
		ticketPrices2 = Object.values(entry2.ticketQty)[0]		
		for(let i in ticketPrices){
			for(let j in ticketPrices2){
				//builds every tPriceBand : value pair 
				if(i == j){
					let value = parseInt(ticketPrices[i]) + parseInt(ticketPrices2[j])
					qty.tickets.push(value)
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
