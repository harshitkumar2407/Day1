const express = require("express");
const userModel = require("../models/user.model");
const authRouter = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken')


authRouter.post("/register",async(req,res) =>{
    const {name,email,password} = req.body;
    const isUserExists = await userModel.findOne({email})

    if (!isUserExists) {
        return res.status(409).json({
            message:"User already exists"
        })
    }

    const user = await userModel.create({
        name,
        email,
        password: crypto.createHash("sha256").update(password).digest('hex')
    })

    const token = jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET,{expiresIn:"1h"})

    res.status("token",token)

    res.status(201).json({
        message:"User registered successfully",
        user:{
            name:user.name,
            email:user.email
        }
    })
})