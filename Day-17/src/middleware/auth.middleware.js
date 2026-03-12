const jwt = require("jsonwebtoken")

async function identifyUser(req,res,next) {
    // get data form cookies
    const token = req.cookies.token
    // check it have token or not 
    if (!token) {
        return res.status(401).json({
            message:"UnAuthorisex Access"
        })
        // chek token is created by us or not
    }
    let decoded = null
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        res.status(401).json({
            message:"Invalid token"
        })
    }
    // get id of the user Id and post Id
    req.user = decoded

    next()
}

module.exports = identifyUser