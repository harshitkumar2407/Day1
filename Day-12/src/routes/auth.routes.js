const express = require("express");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken")
const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const isUserAlreadyExists =await userModel.findOne({email})

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message:"User is already exits with this email address (auth.routs.js)"
            })
        }
        const user = await userModel.create({
            email,
            name,
            password
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

module.exports = authRouter;