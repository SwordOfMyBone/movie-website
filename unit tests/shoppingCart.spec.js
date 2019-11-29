'use strict'

const Cart = require('../modules/shoppingCart.js')

describe('add()', () => {
	test('adding items that isn\'t in the cart returns undefined', async done => {
		const cart = await new Cart()
		const add = await cart.add('123')
		expect(add).toBeUndefined()
		done()
	})

	test('adding an item to the cart', async done => {

		await cart.add('Potato')
		console.log(cart.cart.get('Potato'))
		const x = {'qty': 1, 'title': undefined}
		const y = cart.cart.get('Potato')
		expect(y).toEqual(x)
		done()
	})
})

describe('remove()',() => {
	test('Remove an item that doesn\'t exist', async done => {
		expect.assertions(1)
		const cart = await new Cart()
		await expect(cart.remove('')).rejects.toEqual( Error('ticket not in cart'))
		done()
	})
	test('Remove an item that exists', async done => {
		expect.assertions(1)
		const cart = await new Cart()
		await cart.add('Chicken')
		const remover = await cart.remove('Chicken')
		expect(remover).toBe(undefined)
		done()
	})
})

describe('decrement()',() => {
	test('If only one ticket is present then delete it from cart', async done => {
		expect.assertions(1)
		const cart = await new Cart()
		await cart.add('Avatar')
		const decrement = await cart.decrement('Avatar')
		await expect(decrement).toBeUndefined()
		done()
	})

})

// Function to be checked .key 
describe('check(item)',() => {
test('error if blank item', async done => {
		expect.assertions(1)
		const cart = await new Cart()
		await expect( cart.check('') )
		.rejects.toEqual( Error('missing item') )
		done()
	})

})













// bugged needs fixing 
	// test('If more than one ticket is present decrement by one', async done => {
	// 	expect.assertions(1) // Having issues with remove.
	// 	const cart = await new Cart() 
	// 	await cart.add('Avatar',2)
	// 	const decrement = await cart.decrement('Avatar')
	// 	await expect(decrement).toBe()
	// 	done()
	// })

// async decrement(item) {
// 	try{
// 		const current = this.cart.get(item)
// 		if (current.qty === 1) {
// 			this.cart.delete(item)
// 			return
// 		}
// 		current.qty -= 1
// 		this.cart.set(item, current)
// 	} catch(err) {
// 		throw err
// 	}
// }

// describe('check(item)',() => {
// 	test('Check if the item added is on the cart page', async done => {
// 		const cart = await new Cart()
// 		const add = await cart.add('Anything')
// 		expect(add('Anything')).toEqual(check('Anything'))
// 		done()
// 	})
// })

// })
