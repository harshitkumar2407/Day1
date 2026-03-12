const express = require("express")
const userModel = require("../models/user.model")
const authRouter = express.Router()
const jwt = require("jsonwebtoken")



authRouter.post("/signup",async(req,res)=>{
    const {name , username,password} = req.body

    const isUserExist =await userModel.findOne({username})

    if (isUserExist) {
        return res.status(400).json({
            message:"this user is already exist",isUserExist
        })
    }

    const user = await userModel.create({name, username, password})

    const token = jwt.sign(
        {
            id:user._id,
            username:user.username
        },process.env.JWT_SECRET
    )
    res.cookie("Token",token)

    res.status(201).json({
        message:"New user register",
        user,token
    })
})

authRouter.get("/userinfo",async(req,res)=>{
    const userDetails = await userModel.find()

    res.status(200).json({
        message:"User details",
        userDetails
    })
})





module.exports = authRouter