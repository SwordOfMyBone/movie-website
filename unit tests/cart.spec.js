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
describe('remove()',() => {
	test('Removing something from cart', async done => {
		const cart = await new Cart()
		const remove = cart.remove('Avatar')
		expect(remove).not.toBe('Avatar')
		done()
	})

})
// describe('addCart()',()=>{
// 	test('Adding to cart', async done =>{
// 		const cart = await new Cart()
// 		const addCart = cart.addCart('Avatar','28-Dec-2019','13:00','2','2','2')
// 		expect(addCart).toEqual(true)
// 	})
// })