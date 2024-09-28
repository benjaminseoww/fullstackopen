const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')
const logger = require('./utils/logger')

mongoose.set('strictQuery', false)
mongoose.connect(config.MONGO_URI).then(() => {
    logger.info('Connected to MongoDB')
}).catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
})

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter) // to use the router later

app.use(middleware.errorHandler)

module.exports = app