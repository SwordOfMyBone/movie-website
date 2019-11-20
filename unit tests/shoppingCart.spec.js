'use strict'

const Cart = require('../modules/shoppingCart.js')

describe('add(item)', () => {
	// test('adding items that isn\'t in the cart returns undefined', async done => {
	// 	const cart = await new Cart()
	// 	const add = await cart.add('123')
	// 	expect(add).toBeUndefined()
	// 	done()
    // })

	test('If it adds the items that isn\'t in the cart', async done => {
		const cart = await new Cart()
        const add = await cart.add('Anything')
        expect(add.cart.toContain('x'))
        done()
	})
})
