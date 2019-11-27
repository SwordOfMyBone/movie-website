/*Cart entry is made of a Ticket obj(date, time and name) and Ticketqty (high, med and low),
two seperate objects for price band + qty and ticket details
*/
const Ticket = require('./ticket')


module.exports = class CartEntry {
	
	constructor(ticket, ticketQty){
		if(typeof(ticket) !== 'object' && typeof(ticketQty) !== 'object'){
			throw Error ('Invalid cart entry')
		}
		this.ticket = ticket
		this.ticketQty = ticketQty
	}

	getTicket(){
		return this.ticket
	}

	getTicketQty(){
		return this.ticketQty
	}

	getPrice(){
		console.log(this.ticketQty.tickets)
		console.log(this.ticket)
		let ticket = new Ticket()
		let ticketArr = this.ticketQty.tickets
		console.log(ticketArr[0])
		for(let i in Object.values(this.ticketQty)){
			let low = tickets.getBands(this.ticket.name, this.ticket.date, this.ticket.time, ticketArr[i])

		}


	}
}