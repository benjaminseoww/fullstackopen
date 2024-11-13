const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post("/", async (request, response) => {
    const body = request.body
    const username = body.username
    const password = body.password

    const user = await User.findOne({username: username}).exec()

    if (!user) {
        return response.status(401).json({
            error: "Username Not Found"
        })
    }

    const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

    if (!passwordCorrect) {
        return response.status(401).json({
            error: "Incorrect Password"
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }
    
    const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60*60 })

    response.status(200).send({ token, username: user.username, name: user.name })

});


module.exports = loginRouter;