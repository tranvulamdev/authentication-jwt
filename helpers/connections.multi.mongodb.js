const mongoose = require('mongoose')

require('dotenv').config()

function newConnection(uri) {
	const conn = mongoose.createConnection(uri)

	conn.on('connected', function () {
		console.log(`MongoDB::: connected:::${this.name}`)
	})

	conn.on('disconnected', function () {
		console.log(`MongoDB::: disconnected:::${this.name}`)
	})

	conn.on('error', function (err) {
		console.log(`MongoDB::: connected:::${JSON.stringify(err)}`)
	})

	process.on('SIGINT', async () => {
		await conn.close()
		process.exit(0)
	})

	return conn
}

// make connection to DB test
const testConnection = newConnection(process.env.URI_MONGODB_TEST)
const userConnection = newConnection(process.env.URI_MONGODB_USERS)

module.exports = {
	testConnection,
	userConnection,
}
