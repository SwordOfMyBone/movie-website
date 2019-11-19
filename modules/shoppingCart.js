'use strict'

// Pass cookie session into shopping cart constructor to add cart map.
// first object in map is changeable, second object should represent ticket object.
module.exports = class Cart {
	constructor() {
		this.cart = new Map()
		return this
	}


	async add(item) {
		try{
			//if not found in cart add a new one. Also add error checking
			if (this.cart.get(item) === undefined) {
				this.cart.set(item, {'title': item.name, 'qty': 1})
			} else{
				const x = this.cart.get(item)
				x.qty += 1
				this.cart.set(item, x)
			}

		} catch(err) {
			throw err
		}
	}

	async check(item) {
		try{
			for(const entry in item.keys()) {
				if(typeof entry !== 'object') throw Error('Ticket info invalid.')
			}
			return true
		} catch(err) {
			throw err
		}
	}

	async decrement(item) {
		try{
			const current = this.cart.get(item)
			if (current.qty === 1) {
				this.cart.delete(item)
				return
			}
			current.qty -= 1
			this.cart.set(item, current)
		} catch(err) {
			throw err
		}
	}

	async remove(item) {
		try{
			if (this.cart.get(item) === undefined) {
				throw new Error('ticket not in cart')
			}
			this.cart.delete(item)
		} catch(err) {
			throw err
		}
	}

	async count() {
		return this.cart.size
	}
}

