const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:[true, "with this E-mail is already exist"]
    },
    password:{
        type:String,
        unique:[true,"Input the password"]
    }

})

const userModel = mongoose.model("UserDetails",userSchema)

module.exports = userModel