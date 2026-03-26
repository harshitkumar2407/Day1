const { Schema, model } = require("mongoose");


const userSchema = Schema({
    name:String,
    email:{
        type:String,
        unique:[true , "This email is already used for registration"]
    },
    password:String

})

const userModel = model("user",userSchema);

module.exports = userModel;
