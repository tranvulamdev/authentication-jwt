const createError = require('http-errors')

const User = require('../models/user.model')
const { userValidate } = require('../helpers/validation')
const {
	signAccessToken,
	signRefreshToken,
	verifyRefreshToken,
} = require('../helpers/jwt.service')
const client = require('../helpers/connections.redis')

module.exports = {
	register: async (req, res, next) => {
		try {
			const { email, password } = req.body

			const { error } = userValidate(req.body)

			if (error) throw createError(error.details[0].message)

			const isExist = await User.findOne({ email })

			if (isExist) throw createError.Conflict(`${email} is already registered`)

			const newUser = await User.create({ email, password })

			return res.json({
				status: 'OK',
				elements: newUser,
			})
		} catch (err) {
			next(err)
		}
	},

	refreshToken: async (req, res, next) => {
		try {
			const { refreshToken } = req.body
			if (!refreshToken) throw createError.BadRequest()

			const { userId } = await verifyRefreshToken(refreshToken)

			const accessToken = await signAccessToken(userId)

			const refToken = await signRefreshToken(userId)

			res.json({ accessToken, refreshToken: refToken })
		} catch (err) {
			next(err)
		}
	},

	login: async (req, res, next) => {
		try {
			const { error } = userValidate(req.body)

			if (error) throw createError(error.details[0].message)

			const { email, password } = req.body

			const user = await User.findOne({ email })

			if (!user) throw createError.NotFound('User is not registered')

			const isValid = await user.checkPassword(password)

			if (!isValid) throw createError.Unauthorized()

			const accessToken = await signAccessToken(user._id)

			const refreshToken = await signRefreshToken(user._id)

			res.json({ accessToken, refreshToken })
		} catch (err) {
			next(err)
		}
	},
	logout: async (req, res, next) => {
		try {
			const { refreshToken } = req.body

			if (!refreshToken) throw createError.BadRequest()

			const { userId } = await verifyRefreshToken(refreshToken)

			const reply = await client.del(userId.toString())

			if (!reply) throw createError.InternalServerError()

			res.json({ message: 'Logout!' })
		} catch (err) {
			next(err)
		}
	},

	lists: async (req, res, next) => {
		const users = [
			{
				email: 'abc@gmail.com',
			},
			{
				email: 'def@gmail.com',
			},
		]

		res.json({ users })
	},
}
