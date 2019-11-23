module.exports = {}
const help = require('./help')


//Holds cart entries, which are made of tickets + qty object for each price band
module.exports = class Cart{
	constructor(oldCart = null){
		if(oldCart === null){
			this.itemlist = []
		}
		else{
			this.itemlist = oldCart.itemlist
		}
	}

	add(cartEntry){
		try{
		//	if(typeof(cartEntry) !== 'object') throw Error('invalid attempt to add object into cart')
			for(let i in this.itemlist){
				if(help.compare(cartEntry, this.itemlist[i])){
					let newObj = help.entryAdd(this.itemlist[i], cartEntry)
					this.itemlist.push(newObj)	
					this.itemlist.splice(i,1)
					return true
				}
			}
			this.itemlist.push(cartEntry)
			return true
		}
		catch(err){
			throw err
		}
	}


	async get(){
		return this.itemlist
	}


	//removes entry
	async remove(entry){
		for(let i in this.itemlist){
			if(help.compare(entry, this.itemlist[i])){
				this.itemlist.splice(i,1)
			}
		}
	}
}





// 	//handles incrementing two obj and returns a new object
// let	entryAdd = (entry,entry2) => {
// 		let qty = {}
// 		for(let i of Object.entries(entry.ticketQty)){
// 			for(let j of Object.entries(entry2.ticketQty)){
// 				//builds every tPriceBand : value pair 
// 				if(JSON.stringify(i[0]) === JSON.stringify(j[0])){
// 					let value = parseInt(i[1])+parseInt(j[1])
// 					let tType = i[0]
// 					qty[tType] =  value
// 				}
// 			}
// 		}
// 		let obj = new CartEntry(entry.ticket, qty)
// 		return obj
// 	}

// //compares two cartEntry objects
// comp = module.exports.comp =  (entry, entry2) => {
// 	if( JSON.stringify(entry.ticket) === JSON.stringify(entry2.ticket)){
// 		return true
// 	}
// 	return false
// }

