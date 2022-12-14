
'use strict'

const Accounts = require('../modules/user.js')

describe('register()', () => {
	test('register a valid account', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		const register = await account.register('doej', 'password','email@gmail.com')
		expect(register).toBe(true)
		done()
	})

	test('register a duplicate username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password','email@gmail.com')
		await expect( account.register('doej', 'password','email@gmail.com') )
			.rejects.toEqual( Error('username "doej" already in use') )
		done()
	})

	test('error if blank username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('', 'password','email@gmail.com') )
			.rejects.toEqual( Error('missing username') )
		done()
	})

	test('error if blank password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', '','email@gmail.com') )
			.rejects.toEqual( Error('missing password','email@gmail.com') )
		done()
	})
	test('error if blank email', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password','') )
			.rejects.toEqual( Error('Email should be longer than 5 characters') )
		done()
	})
	test('error dot comes before @', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password','em.em@gmail.com') )
			.rejects.toEqual( Error('INVALID EMAIL') )
		done()
	})
/*	test('No @ in email', async done => { // its expecting an invalid email error, to be reviewed 
		expect.assertions(1)
		const account = await new Accounts()
		await expect( account.register('doej', 'password','Email') )
			.rejects.toEqual( Error('email should contain a @ after the first character') )
		done()
	}) */

})

describe('uploadPicture()', () => {
	// this would have to be done by mocking the file system
	// perhaps using mock-fs?
})

describe('login()', () => {
	test('log in with valid credentials', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password','email@gmail.com')
		const valid = await account.login('doej', 'password','email@gmail.com')
		expect(valid).toBe(true)
		done()
	})

	test('invalid username', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password','email@gmail.com')
		await expect( account.login('roej', 'password','email@gmail.com') )
			.rejects.toEqual( Error('username "roej" not found') )
		done()
	})

	test('invalid password', async done => {
		expect.assertions(1)
		const account = await new Accounts()
		await account.register('doej', 'password','email@gmail.com')
		await expect( account.login('doej', 'bad','email@gmail.com') )
			.rejects.toEqual( Error('invalid password for account "doej"') )
		done()
	})
})
// describe('isAdmin()',() => {
// 	test('Not an admin',async done =>{
// 		//expect.assertions(1)
// 		const account = await new Accounts()
// 		await account.isAdmin('Joe','dbName')
// 		await expect(account.isAdmin('Joe','dbName'))
// 			.rejects.toEqual( Error('false'))
// 		done()

// 	})
// })
