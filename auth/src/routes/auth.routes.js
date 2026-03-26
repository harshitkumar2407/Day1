const express = require("express");
const userModel = require("../models/user.model");
const crypto = require("crypto")
const jwt = require("jsonwebtoken")

const authRouter = express.Router();

/**
*  @route POST /api/auth/regiter
*  @name regiter
*  @description Register a new user the the data base
*  @access Public
*/
authRouter.post("/register",async (req,res)=>{
    const {name, email, password} = req.body;

    const isUserExists = await userModel.findOne({email});

    if (isUserExists) {
        return res.status(409).json({
            message:"User is already exist"
        })
    }
    const hash = crypto.createHash("sha256").update(password).digest('hex')

    const user = await userModel.create({
        name,email,password:hash
    })

    const token = jwt.sign(
        {id:user._id,},process.env.JWT_SECRET,{expiresIn:"1h"})

    res.cookie("token",token)

    res.status(201).json({
        message:"User register successfully",
        user:{
            name:user.name,
            email:user.email
        }
    })


})

/**
*  @route POST /api/auth/login
*  @name login
*  @description Login to the user
*  @access Public
*/
authRouter.post('/login',async(req,res) =>{
    const { email , password } = req.body;

    const user = await userModel.findOne({email})
    if (!user) {
        return res.status(400).json({
            message:"User is not found"
        })
    }
    const hash = crypto.createHash("sha256").update(password).digest('hex')

    const isPasswordValid = hash === user.password
    // console.log(hash);
    if(!isPasswordValid)
        return res.status(401).json({
            message:"Invalid password"
        })
    
    const token = jwt.sign({
        id:user._id
    },process.env.JWT_SECRET,{expiresIn:"1h"})
})

authRouter.get("/getme", async (req,res) =>{
    const token = req.cookies.token
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    console.log(decoded);
})


module.exports = authRouter

// File: auth.routes.js
// Author: Harshit
// Year: 2026