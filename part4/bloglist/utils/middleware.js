const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('./config')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "MongoServerError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }

  next(error);
}

const tokenExtractor = (request, response, next) => {
  // code that extracts the token
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
      request["token"] = authorization.replace('Bearer ', '');
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token;

  if (!token) {
    return response.status(401).json({ error: 'Token not found'});
  }

  const decodedToken = jwt.verify(token, config.SECRET);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'Decoded Token Invalid' })
  }

  try {
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response.status(404).json({ message: 'User not found' });
    }

    request["user"] = user;

    next()
  } catch (error) {
    next(error);
  }
}

module.exports = {
    errorHandler,
    tokenExtractor,
    userExtractor
}