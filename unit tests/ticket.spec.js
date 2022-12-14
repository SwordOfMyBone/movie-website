'use strict'

const Tickets = require('../modules/ticket.js')

describe('addToDb()', () => {
	test('Adding a user and his purchase to the db', async done => {
		const ticket = await new Tickets()
		const addToDb = await ticket.addToDb('123','The Gods','12')
		expect(addToDb).toBe(true)
		done()
	})

	test('error if blank movie name', async done => {
		expect.assertions(1)
		const ticket = await new Tickets()
		await expect( ticket.addToDb('12', '','13') )
			.rejects.toEqual( Error('missing movieName') )
		done()
	})

	test('error if price is blank on purchase', async done => {
		expect.assertions(1)
		const ticket = await new Tickets()
		await expect( ticket.addToDb('12', 'The delusion','') )
			.rejects.toEqual( Error('missing price') )
		done()
	})

	test('error if the tickets have no owner', async done => {
		expect.assertions(1)
		const ticket = await new Tickets()
		await expect( ticket.addToDb('', 'The delusion','12') )
			.rejects.toEqual( Error('missing user id') )
		done()
	})

})


beforeAll( async() => {
	// stuff to do before any of the tests run
})
afterAll( async() => {
	// runs after all the tests have completed
})
describe('Ticket()', () => {

	test('Ticket qty must be a number', async done => {
		expect.assertions(1)
		try {
			todo.add('Advtar', 'three')
			done.fail('test failed')
		} catch(err) {
			expect(err.message).toBe('qty must be a number')
		} finally {
			done()
		}
	})
})
	/*  bug encountered
describe('getTickets()', () => {
	test('Adding specific ticket for user', async done => {
		const ticket = await new Tickets()
		const getTickets = await ticket.getTickets('')
		expect(getTickeks).toBe(true)
		done()
	})
})
*/

