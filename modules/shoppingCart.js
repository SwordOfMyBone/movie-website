'use strict'

// Pass cookie session into shopping cart constructor to add cart map.
// first object in map is changeable, second object should represent ticket object.
// name space

module.exports = {}
module.exports.cart = class Cart {
	constructor() {
		this.list = new Map()
		this.list.set("ticket Obj", "qty Obj")
		return mapToJson(this.list)
	}
}

module.exports.add = async (cart,item, body) => {
		try{
			//if not found in cart add a new one. Also add error checking
			console.log(cart)
			if (cart.list.get(item) === undefined) {
				cart.list.set(item, body)
			} else{
				const x = cart.list.get(item)
				x.qty += 1
				cart.list.set(item, x)
			}

		} catch(err) {
			throw err
		}
}


module.exports.check = async (cart, item) =>  {
	try{
		for(const entry in item.keys()) {
			if(typeof entry !== 'object') throw Error('Ticket info invalid.')
		}
		return true
	} catch(err) {
		throw err
	}
}


module.exports.decrement = async (cart, item) => {
	try{
		const current = cart.list.get(item)
		if (current.qty === 1) {
		cart.list.delete(item)
			return
		}
		current.qty -= 1
		cart.list.set(item, current)
	} catch(err) {
		throw err
	}			
}

module.exports.remove = async (cart, item) =>  {
	try{
		if (cart.list.get(item) === undefined) {
			throw new Error('ticket not in cart')
		}
		cart.list.delete(item)
	} catch(err) {
		throw err
	}
}

module.exports.count = async (cart) =>{
	return cart.list.size
}

function mapToJson(map) {
  return JSON.stringify(map);
}

function jsonToMap(jsonStr) {
  return new Map(JSON.parse(jsonStr));
}