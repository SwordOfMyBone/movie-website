'use strict'

const Production = require('../modules/production.js')
const Ticket = require('../modules/ticket.js')

describe('createShow()',()=>{
	test('Creating a show', async done =>{
		//expect.assertions(1)
		const prod = await new Production()
		await prod.createShow('x','x','x','x','x','x','x','x','x')
		const count = await prod.countItems()
		const count1 = await prod.countItems()
		expect(count).toBe(1)
		expect(count1).toBe(1)
		done()
	})
})
describe('movieName()',()=>{
	test('Select details of a movie', async done()=>{
		expect.assertions(1)
		prod = await new Production()
		await prod.movieName('1')
		expect(prod).toBe(true)
	})
})

















































// describe('prodDetails()', () =>
//  {

// 	test('No Films Within dB', async done => {
// 		expect.assertions(1)
// 		const production = await new Production()
// 		await expect( production.prodDetails('10' ))
// 			.rejects.toEqual( Error('missing Movie') ) 
// 		done()
// 	})

// 	test('Valid Entry of Movie in dB', async done => {
// 		expect.assertions(0)
// 		const production = await new Production()
// 		const prodDetails = await production.prodDetails('Advatar','3')
// 		expect(prodDetails).toBe(undefined)
// 		done()
// 	})
// }) 

// //db.all linked to issue for both of the below unit tests 
// describe('createShow()', () => {
// 	test('Insert details to the database', async done => {
// 		const production = await new Production()
// 		//await production.createShow("Advatar")
// 		const result = await production.createShow("Advatar","26/11/2019","12:00pm","1","3","5")
// 		//let createShow = "Advatar";
// 		expect(result).toBe(true)
// 		done()
// 	})
// })

// describe('showTime()', () => {

// 	test('Check to see if production is showing Movies', async done => {
// 		const production = await new Production()
// 		const showTime = await production.showTime("")
// 		expect(showTime).toBe(undefined)
// 		done()
// 	}) 

// })

