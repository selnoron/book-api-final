const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (user) => {
  if (!process.env.JWT_SECRET) {
    const err = new Error('jwt secret is missing in .env')
    err.statusCode = 500
    throw err
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  )
}

const register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() })
    if (exists) {
      return res.status(400).json({ message: 'user already exists' })
    }

    const user = await User.create({
      email,
      password,
      role: role === 'admin' ? 'admin' : 'user'
    })

    const token = signToken(user)

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(401).json({ message: 'invalid credentials' })
    }

    const match = await user.matchPassword(password)
    if (!match) {
      return res.status(401).json({ message: 'invalid credentials' })
    }

    const token = signToken(user)

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    })
  } catch (err) {
    next(err)
  }
}

const me = async (req, res, next) => {
  try {
    res.status(200).json({
      user: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      }
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, me }
