const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router()
const User = require('../models/user')  

// blogs requests 
usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', "url title author id");
    response.json(users)
})
  
usersRouter.post('/', async (request, response) => {
  const body = request.body;

  if (!body.name || !body.username || !body.password) {
    response.status(400).end();
  }

  if (body.password.length < 3) {
    return response.status(400).json({ error: 'Password must be at least 3 characters long' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(body.password, salt);

  const user = new User({
    name: body.name,
    username: body.username,
    passwordHash: passwordHash
  });

  const savedUser = await user.save();
  response.status(201).json(savedUser)
})

usersRouter.delete('/:id', async (request, response) => {
  // if the id is not valid return 400
  const id = request.params.id;

  if (!id) {
    return response.status(400).end();
  }

  const user = await User.findById(id);
  if (!user) {
    return response.status(400).end();
  }

  await User.findByIdAndDelete(id);

  // return 204 if successful
  response.status(204).end();
})


module.exports = usersRouter;