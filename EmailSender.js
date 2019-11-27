'use strict'
require('dotenv').config()
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD
	}
})

let mailOptions = {
	from: 'xtheaters.do.not.reply@gmail.com',
	to: 'a1998ed@gmail.com', //Should be user email
	subject: ' Testing if app works',
	text: 'Hello this is Xtheaters'
}

transporter.sendMail(mailOptions,(err,data) => {
	if(err) {
		console.log('Error Occurs',err)
	} else {
		console.log('Email sent!!!')
	}
})

