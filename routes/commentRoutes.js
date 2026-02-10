const express = require('express')
const router = express.Router()

const { deleteComment } = require('../controllers/commentController')
const protect = require('../middleware/authMiddleware')
const adminOnly = require('../middleware/adminMiddleware')

router.delete('/:id', protect, adminOnly, deleteComment)

module.exports = router
