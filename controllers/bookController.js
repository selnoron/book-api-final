const mongoose = require('mongoose')
const Book = require('../models/Book')

const createBook = async (req, res, next) => {
  try {
    console.log('req.body:', req.body)
    console.log('req.file:', req.file)
    const body = req.body || {}
    const title = body.title
    const author = body.author
    const price = body.price
    const description = body.description
    const genre = body.genre
    const year = body.year

    if (!title || !author || price === undefined || !description || !req.file) {
      return res.status(400).json({ message: 'required fields missing' })
    }

    const book = await Book.create({
      title: String(title).trim(),
      author: String(author).trim(),
      price: Number(price),
      description: String(description).trim(),
      imageUrl: `/uploads/books/${req.file.filename}`,
      genre: genre ? String(genre).trim() : 'unknown',
      year: year ? Number(year) : undefined,
      createdBy: req.user?._id
    })

    res.status(201).json(book)
  } catch (err) {
    next(err)
  }
}

const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 })
    res.status(200).json(books)
  } catch (err) {
    next(err)
  }
}


const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'invalid book id' })
    }

    const book = await Book.findById(id)
    if (!book) {
      return res.status(404).json({ message: 'book not found' })
    }

    res.status(200).json(book)
  } catch (err) {
    next(err)
  }
}

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'invalid book id' })
    }

    const book = await Book.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    })

    if (!book) {
      return res.status(404).json({ message: 'book not found' })
    }

    res.status(200).json(book)
  } catch (err) {
    next(err)
  }
}

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'invalid book id' })
    }

    const book = await Book.findByIdAndDelete(id)
    if (!book) {
      return res.status(404).json({ message: 'book not found' })
    }

    res.status(200).json({ message: 'book deleted' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook
}
