const jwt = require('jsonwebtoken')

const genrateToken = (userId)=>{
    return jwt.sign({id: userId}, process.env.JWY_SECRET_KEY, {
        expiresIn:'30d'
    })
}

module.exports = genrateToken;