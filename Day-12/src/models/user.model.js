const mongoose = require("mongoose")

const useSehema = new mongoose.Schema({
    name :String,
    email:{
        type:String,
        unique:[true,"with this email user account is created already exists(user.moduler.js email unique )"]
    },
    password: String,
}) 

const userModel = mongoose.model("user",useSehema)

module.exports = userModel