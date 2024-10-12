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

blogsRouter.delete('/:id', async (request, response) => {
  // if the id is not valid return 400
  const id = request.params.id;

  if (!id) {
    return response.status(400).end();
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return response.status(400).end();
  }

  await Blog.findByIdAndDelete(id);

  // return 204 if successful
  response.status(204).end();
})

module.exports = blogsRouter