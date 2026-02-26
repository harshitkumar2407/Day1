const mongoose = require("mongoose")

const useSehema = new mongoose.Schema({
    name : String,
    email:{
        type:String,
        uniqui:[true, "with this email email is created "]
    },
    password:String,
})

const userModel = mongoose.model("user",useSehema)

module.exports = userModel