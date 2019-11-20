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

 

describe('showTime'(), () => {

	test('Enter the details to dB', async done => {
		expect.assertions(4)
		const production = await new Production()
		const moviePic = await production.moviePic('Advatar,25/11/2019,12:00pm')
		expect(moviePic).toBe(true)
		done()
	})

})


 

describe('createshow()', () => {

	test('', async done => {
		const production = await new Production()
		const createshow = await production.createshow('.png')
		expect(createshow).toBe(true)
		done()
	})

})

