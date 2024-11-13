const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog');  
const User = require('../models/user');
const config = require('../utils/config');
const { tokenExtractor, userExtractor } = require('../utils/middleware');

// helper functions
// const getTokenFrom = request => {
//   const authorization = request.get('authorization');
//   if (authorization && authorization.startsWith('Bearer ')) {
//     return authorization.replace('Bearer ', '');
//   }
//   return null;
// }

// blogs requests 
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', "username name id");
    response.json(blogs)
})
  
blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    response.status(400).end();
  }

  // TODO: get the middleware to take in decodedToken and check for the users
  const user = request.user;

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user
  });

  user.blogs = user.blogs.concat(blog._id);
  await user.save();

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
  const id = request.params.id;
  if (!id) {
    return response.status(400).end();
  }
  const testBlog = await Blog.findById(id);
  if (!testBlog) {
    return response.status(400).end();
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, request.body, { new: true });
  response.status(200).json(updatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  
  // check if logged in 
  const decodedToken = jwt.verify(request.token, config.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  // if the id is not valid return 400
  const id = request.params.id;

  if (!id) {
    return response.status(400).end();
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return response.status(400).end();
  }

  const user = request.user; 

  // check if the user is the creator of the blog, if not do not allow it
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(401).json({ error: 'unauthorized' });
  }

  await Blog.findByIdAndDelete(id);

  // return 204 if successful
  response.status(204).end();
})

module.exports = blogsRouter