const jwt = require('jsonwebtoken')
const User = require('../models/User')

// тут проверяется jwt и подцепляется пользователь
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'not authorized, no token' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'not authorized, user not found' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'not authorized, token failed' })
  }
}

module.exports = protect
