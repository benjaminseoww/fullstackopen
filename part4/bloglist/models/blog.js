const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: {
      type: Number,
      default: 0
    } 
  })

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject.__v
      delete returnedObject._id
    }
})
  
const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog