const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

const connectDB = require('./config/db')

const authRoutes = require('./routes/authRoutes')
const bookRoutes = require('./routes/bookRoutes')
const commentRoutes = require('./routes/commentRoutes')

const errorHandler = require('./middleware/errorHandler')

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static('public'))

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/comments', commentRoutes)
app.use('/uploads', express.static('uploads'))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
