const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String,
    username: {
      type: String,
      unique: true,
      minLength: 3
    },
    passwordHash: {
      type: String,
    },
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
      }
    ]
  })

  userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject.__v
      delete returnedObject._id
    }
})
  
const User = mongoose.model('User', userSchema)

module.exports = User