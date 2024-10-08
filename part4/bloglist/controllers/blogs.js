const blogsRouter = require('express').Router()
const Blog = require('../models/blog')  

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs)
})

  
blogsRouter.post('/', async (request, response) => {
  const body = request.body;

  if (!body.title || !body.url) {
    response.status(400).end();
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  });

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  // if the id is not valid return 400
  const id = request.params.id;

  if (!id) {
    return response.status(400).end();
  }

  if (Blog.findById(id)) {

  }

  // return 204 if successful
  response.status(204).end();
})

module.exports = blogsRouter