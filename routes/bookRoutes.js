const express = require('express')
const router = express.Router()

const {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
} = require('../controllers/bookController')

const {
  getCommentsByBook,
  addComment
} = require('../controllers/commentController')

const protect = require('../middleware/authMiddleware')
const adminOnly = require('../middleware/adminMiddleware')
const upload = require('../middleware/uploadMiddleware')

router.get('/', getAllBooks)
router.get('/:id', getBookById)

router.get('/:bookId/comments', getCommentsByBook)
router.post('/:bookId/comments', protect, addComment)

router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  createBook
)

router.put('/:id', protect, adminOnly, updateBook)
router.delete('/:id', protect, adminOnly, deleteBook)

module.exports = router
