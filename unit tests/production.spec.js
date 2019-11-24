'use strict'

const Production = require('../modules/production.js')


describe('prodDetails()', () =>
 {

	test('No Films Within dB', async done => {
		expect.assertions(1)
		const production = await new Production()
		await expect( production.prodDetails('10' ))
			.rejects.toEqual( Error('missing Movie') ) 
		done()
	})

	test('Valid Entry of Movie in dB', async done => {
		expect.assertions(0)
		const production = await new Production()
		const prodDetails = await production.prodDetails('Advatar','3')
		expect(prodDetails).toBe(true)
		done()
	})
}) 

//db.all linked to issue for both of the below unit tests 


describe('createShow()', () => {

	test('Insert details to the database', async done => {
		const production = await new Production()
		//await production.createShow("Advatar")
		const result = await production.createShow("Advatar")
		//let createShow = "Advatar";
		expect(result).toBe(true)
		done()
	})
})


describe('showTime()', () => {

	test('Check to see if production is showing Movies', async done => {
		const production = await new Production()
		const showTime = await production.showTime(':memory:')
		expect(showTime).toBe(true)
		done()
	}) 
})

