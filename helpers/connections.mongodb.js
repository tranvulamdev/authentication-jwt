const mongoose = require('mongoose')

const conn = mongoose.createConnection('mongodb://localhost:27017/test')

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

module.exports = conn
