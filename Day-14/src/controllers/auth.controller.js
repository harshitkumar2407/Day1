const User = require("../models/user.models")
const crypto = require("crypto")
const jwt = require("jsonwebtoken")


async function loginController(req,res) {
    const {email,password} = req.body

    const user = await User.findOne({
        $or:[
            {email:email},
            {username:email}
         ]
    })
    
    if (!user) {
        return res.status(404).json({
            message:"User not found"
        })
    }

    const hash = crypto.createHash("sha256").update(password).digest("hex")

    if (hash !== user.password) {
        return res.status(401).json({
            message:"Invalid password"
        })
    }

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})

    res.cookie("token",token)

    res.status(200).json({
        message:"User logged in successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profilePicture:user.profilePicture
        }
    })
}


async function registerController(req,res){
    const {username,email,password,bio,profilePicture} = req.body

    const isUserExist = await User.findOne({
       $or: [
        { email: email },
        { username: username }
    ]
    })

    if (isUserExist) {
        return res.status(409).json({
            message:"user already exist with same" + (isUserExist.email == email ? "Email":"Username") 
        })
    }
    const hash = crypto.createHash("sha256").update(password).digest("hex")
    
    const user = await User.create({
        username,email,password:hash,bio,profilePicture
    })
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1d"})

    res.status(201).json({
        message:"User registered successfully",
        token
    })  

    res.cookie("token",token,)

    res.status(201).json({
        message:"User registered successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profilePicture:user.profilePicture
        }
    })
}

module.exports = {
    loginController,
    registerController
}