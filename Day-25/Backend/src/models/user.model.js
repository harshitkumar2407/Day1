
const { Schema, mongo } = require("mongoose");


const userSchema = Schema({
    username:{
        type:String,
        required:[true,"Username is required"],
        unique:[true,"Username must be unique"]
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email must be unique"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    }
})
const user = mongoose.model("user",userSchema);
module.exports = user;