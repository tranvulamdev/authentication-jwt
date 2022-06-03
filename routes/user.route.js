const express = require('express')
const route = express.Router()
const { verifyAccessToken } = require('../helpers/jwt.service')
const UserController = require('../controllers/user.controller')

route.post('/register', UserController.register)

route.post('/refresh-token', UserController.refreshToken)

route.post('/login', UserController.login)
route.delete('/logout', UserController.logout)

route.get('/lists', verifyAccessToken, UserController.lists)

module.exports = route
