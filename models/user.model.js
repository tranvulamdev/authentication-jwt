const mongoose = require('mongoose'),
	Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const { testConnection } = require('../helpers/connections.multi.mongodb')

const UserSchema = new Schema({
	email: {
		type: String,
		lowercase: true,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
})

UserSchema.pre('save', async function (next) {
	try {
		const salt = await bcrypt.genSalt(10)
		const hashPassword = await bcrypt.hash(this.password, salt)
		this.password = hashPassword
		next()
	} catch (err) {
		next(err)
	}
})

UserSchema.methods.checkPassword = async function (password) {
	return await bcrypt.compare(password, this.password)
}

module.exports = testConnection.model('User', UserSchema)
