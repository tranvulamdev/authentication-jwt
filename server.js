const express = require('express')
const app = express()
const createError = require('http-errors')
const UserRouter = require('./routes/user.route')

require('dotenv').config()
// require('./helpers/connections.mongodb')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res, next) => {
	res.send('Home page')
})

app.use('/user', UserRouter)

app.use((req, res, next) => {
	// const error = new Error('Not Found')
	// error.status = 500
	next(createError.NotFound('This route does not exist.'))
})

app.use((err, req, res, next) => {
	res.json({
		status: err.status || 500,
		message: err.message,
	})
})

const PORT = process.env.PORT || 3500

app.listen(PORT, () => console.log(`Server listening on localhost:${PORT}`))
