'use strict'

const Cart = require('../modules/cart.js')

describe('add()', () => {
	test('Adding something to the cart', async done => {
		const cart = await new Cart()
		const add = await cart.add('Avatar')
		expect(add).toBe(true)
		done()
    })
    
})
