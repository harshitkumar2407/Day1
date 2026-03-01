const userModel = require("../models/user.model")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


async function registerController(req, res)  {
    const { email, username, password, bio, profileImage} = req.body

    const isUserAlreadyExists = await userModel.findOne({
        $or:[{ username }, { email }]
    })

    if (isUserAlreadyExists) {
        return res.status(409)
            .json({message:"User already exists " + (isUserAlreadyExists == email ? "Email" :"username" )
            })
    }
    // const hash = crypto.createHash("sha256").update(password).digest("hex")
    const hash = await bcrypt.hash(password,10)

    const user = new userModel({ email, username, password: hash, bio, profileImage
    })
    await user.save();
    const token = jwt.sign(
        {   id:user._id     },process.env.JWT_SECRET,
        {expiresIn:"1d"})

    res.cookie("token",token)

    res.status(201).json({
        message:"User Registered successfully",
        user:{
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }})
}

async function  loginControler(req,res) {
    const {username, email, password } =req.body

    const user = await userModel.findOne({
        $or:[
            {username:username},
            {email:email}
        ]})

    // const hash = crypto.createHash("sha256").update(password).digest('hex')

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message:"password invalid"
        })
    }

    const token = jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token)

    res.status(200).json({
        message:"User loggedIn successfully.",
        user:{
            username:user.username,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

module.exports ={
    registerController,
    loginControler
}