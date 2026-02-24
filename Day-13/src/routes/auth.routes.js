const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")
const authRouter = express.Router();
const crypto = require("crypto")

authRouter.post("/register", async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const isUserAlreadyExists =await userModel.findOne({email})

        if (isUserAlreadyExists) {
            return res.status(409).json({
                message:"User is already exits with this email address (auth.routs.js)"
            })
        }
        const hashedPassword = crypto.createHash("md5").update(password).digest("hex")

        const user = await userModel.create({
            name,
            email,
            password:hashedPassword
        });
        const token = jwt.sign({
            id:user._id,
            email:email
            },process.env.JWT_SECRET
        )   
        res.cookie("jwt_token",token)
        
            res.status(201).json({
                message: "User registered successfully",
                user,token
            });

    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error.message
        });
    }
});

authRouter.post("/protected",(req,res)=>{
    console.log(req.cookies);
    res.status(200).json({
        message:"this is protected"
    })
    
})

// Controller
authRouter.post("/login",async(req,res)=>{
    const {email,password} =req.body
    const user = await userModel.findOne({email })

    if (!user) {
        return res.status(404).json({
            message:"User not found with this email address"
        })
    }

    const isPasswordMatched = user.password === crypto.createHash("md5").update(password).digest("hex")

    if (!isPasswordMatched) {
        return res.status(401).json({
            message:"Invalid password"
        })
    }

    const token = jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET)
    res.cookie("jwt_token",token)
    res.status(200).json({
        message:"user logged in",
        user,
    })

})
module.exports = authRouter;