const redis = require('redis')

const client = redis.createClient({
	socket: { port: 6379, host: 'localhost' },
})

client.on('error', err => console.log('Redis::: error', err))

client.connect()

client.on('connect', () => console.log('Redis connected'))

client.on('ready', () => console.log('Redis is ready'))

module.exports = client
