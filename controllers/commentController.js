const mongoose = require('mongoose')
const Comment = require('../models/Comment')


const getCommentsByBook = async (req, res, next) => {
  try {
    const { bookId } = req.params

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'invalid book id' })
    }

    const comments = await Comment.find({ bookId })
      .populate('userId', 'email role')
      .sort({ createdAt: -1 })

    res.status(200).json(comments)
  } catch (err) {
    next(err)
  }
}

const addComment = async (req, res, next) => {
  try {
    const { bookId } = req.params
    const { text, rating } = req.body

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: 'invalid book id' })
    }

    if (!text) {
      return res.status(400).json({ message: 'text is required' })
    }

    const comment = await Comment.create({
      bookId,
      userId: req.user._id,
      text,
      rating
    })

    const populated = await Comment.findById(comment._id).populate('userId', 'email role')

    res.status(201).json(populated)
  } catch (err) {
    next(err)
  }
}

const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'invalid comment id' })
    }

    const deleted = await Comment.findByIdAndDelete(id)
    if (!deleted) {
      return res.status(404).json({ message: 'comment not found' })
    }

    res.status(200).json({ message: 'comment deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getCommentsByBook,
  addComment,
  deleteComment
}
