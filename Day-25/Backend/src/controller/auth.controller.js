const userModel = require("../model/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user.model");


async function registerUser(req,res){
    const {username,email,password} = req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(isAlreadyRegistered){
        return res.status(400).json({
            message:"Username or email already exists"
        })
    }
    
    const hashedPassword = await bcrypt.hash(password,10);
    const newUser = new userModel({
        username,
        email,
        password:hashedPassword
    })
    await newUser.save();
    res.status(201).json({
        message:"User registered successfully"
    })
    const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"1h"});
    res.cookie("token",token)

    return res.status(201).json({
        message:"User registered successfully",
        user:{
            id:newUser._id,
            username:newUser.username,
            email:newUser.email
        }
    })
}

async function loginUser(req,res){
    const {username,email,password} = req.body;

    const user = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })
    if(!user){
        return res.status(400).json({
            message:"Invalid username or email"
        })
    }
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid password"
        })
    }
    const token = jwt.sign(
        {
            id:user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"3d"
        });

    res.cookie("token",token)

    return res.status(200).json({
        message:"User logged in successfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

async function getMe(req,res) {

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "user fetched successfully",
        user
    })

}



module.exports = {
    registerUser,
    loginUser,
    getMe
 }

