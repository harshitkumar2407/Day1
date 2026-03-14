const userModel = require("../models/user.model")
const crypto = require("crypto")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


async function registerController(req, res)  {
    // take input data form the the body
    const { email, username, password, bio, profileImage} = req.body

    // check user is already exist by this user.name or email
    const isUserAlreadyExists = await userModel.findOne({
        $or:[{ username }, { email }]
    })
    //  if yes we can't allow to create the user with the same name Notification
    if (isUserAlreadyExists) {
        const field = isUserAlreadyExists.email === email ? "Email" : "Username";
    
        return res.status(409).json({
            message: `User already exists by ${field}`
        });
    }
    // const hash = crypto.createHash("sha256").update(password).digest("hex")
    const hash = await bcrypt.hash(password,10)
    // send to data base if every thing is correct
    const user = new userModel({ email, username, password: hash, bio, profileImage
    })
    await user.save();
    // 
    const token = jwt.sign(
        {   id:user._id     },process.env.JWT_SECRET,
        {expiresIn:"1d"})

    res.cookie("token",token)
    // Message and user detail if if every thing going right
    res.status(201).json({
        message:"User Registered successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }})
}

async function  loginController(req,res) {
    // import email or username form body
    const {username, email, password } =req.body
    // find out by email or username
    const user = await userModel.findOne({
        $or:[
            {username:username},
            {email:email}
        ]})

    // const hash = crypto.createHash("sha256").update(password).digest('hex')
    // c
    const isPasswordValid = await bcrypt.compare(password,user.password)

    if (!isPasswordValid) {
        return res.status(401).json({
            message:"password invalid"
        })
    }

    const token = jwt.sign(
        {id:user._id,username:user.username },
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
    loginController
}