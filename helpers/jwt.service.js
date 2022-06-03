const JWT = require('jsonwebtoken')
const createError = require('http-errors')

const client = require('../helpers/connections.redis')

module.exports = {
	signAccessToken: async userId => {
		return new Promise((resolve, reject) => {
			const payload = { userId }
			const secret = process.env.ACCESS_TOKEN_SECRET
			const options = { expiresIn: '1h' }

			JWT.sign(payload, secret, options, (err, token) => {
				err && reject(err)
				resolve(token)
			})
		})
	},

	signRefreshToken: async userId => {
		return new Promise(async (resolve, reject) => {
			const payload = { userId }
			const secret = process.env.REFRESH_TOKEN_SECRET
			const options = { expiresIn: '1y' }

			JWT.sign(payload, secret, options, async (err, token) => {
				err && reject(err)
				const reply = await client.set(userId.toString(), token, {
					EX: 365 * 24 * 60 * 60,
				})

				reply && resolve(token)

				return reject(createError.InternalServerError())
			})
		})
	},

	verifyAccessToken: (req, res, next) => {
		if (!req.headers.authorization) return next(createError.Unauthorized())

		const authHeader = req.headers.authorization

		const token = authHeader.split(' ')[1]

		JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
			err && next(createError.Unauthorized(err.message))

			req.payload = payload
			next()
		})
	},

	verifyRefreshToken: async refreshToken => {
		return new Promise((resolve, reject) => {
			JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
				err && reject(err)

				const reply = await client.get(payload.userId)

				!reply && reject(createError.InternalServerError())

				refreshToken === reply && resolve(payload)

				return reject(createError.Unauthorized())
			})
		})
	},
}
