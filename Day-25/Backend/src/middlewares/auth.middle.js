const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");
const redis = require("../config/cashe");


async function authUser(req,res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message:"token not provided"
        })
    }

    // const istokenBlacklisted = await blacklistModel.findOne({token})
    const istokenBlacklisted = await redis.get(token)
    
    if (istokenBlacklisted) {
        return res.status(401).json({
            message:'token is invalid'
        })
    }
    let decoded;
    try {
        
         decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
        )
        req.user = decoded;
        next()
    } catch (error) {
        return res.status(401).json({
            message: "invalid token"
        })
    }
}
module.exports = {authUser}