'use strict'

const Production = require('../modules/production.js')


describe('prodDetails()', () =>
 {

	test('No Films Within dB', async done => {
		expect.assertions(1)
		const production = await new Production()
		await expect( production.prodDetails('The delusion',"" ))
			.rejects.toEqual( Error('missing Movie') ) 
		done()
	})

	test('Valid Entry of Movie in dB', async done => {
		expect.assertions(1)
		const production = await new Production()
		const prodDetails = await production.prodDetails('Advatar')
		expect(prodDetails).toBe(true)
		done()
	})
})

 


