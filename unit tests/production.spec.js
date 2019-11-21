'use strict'

const Production = require('../modules/production.js')


describe('prodDetails()', () =>
 {

	test('No Films Within dB', async done => {
		expect.assertions(1)
		const production = await new Production()
		await expect( production.prodDetails('Avatar',"" ))
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

 
describe('createShow()', () => {

	test('Enter the details to dB', async done => {
		expect.assertions(1)
		const production = await new Production()
		await production.createShow('Advatar,25/11/2019,12:00pm')
		const result = await production.prodDetails("Advatar,25/11/2019,12:00pm", ":memory:")
		expect(result[0]).not.toBeUndefined()
		done()
	})

})

describe('showTime()', () => {

	test('Is the production showing', async done => {
		const production = await new Production()
		const showTime = await production.showTime('Movie')
		expect(showTime).toBe(true)
		done()
	})

})
