const express = require("express");
const userModel = require("../models/notes.model");
const authRouter = express.Router();

app.post("/user",async(req,res) =>{
    try {
        const {name, email, password} = req.body

        const isUserAlreadyExites = await userModel.findOne({email})

        if (isUserAlreadyExites) {
            return res.status(400).json({
                message:"User is already exits with email address "
            })
        }
        const User = userModel.create({name,email,password})
        res.status(201).json({
            message:"User data is added ",User
        })
    } catch (error) {
        res.status(500).json({
            message:"New note is created",
            error: error.message})
    }
})

app.get("/user",async (req,res) =>{
    try {
        const users = await  userModel.find();
        res.status(201).json({
            message:"User Details featch successfully",
            users
        })
    } catch (error) {
        res.status(500).json({error:error.message})
    }
})




app.get("/",(req,res)=>{
    // res.send("Hello mini")
    res.status(200).json({
        notes:notes
    })
})


app.patch("/:index",(req,res) =>{
    notes[ req.params.index].name = req.body.name

})
