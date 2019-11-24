
/*Cart entry is made of a Ticket obj(date, time and name) and Ticketqty (high, med and low),
two seperate objects for price band + qty and ticket details
*/
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


}