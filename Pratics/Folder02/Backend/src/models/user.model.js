const { Schema, model } = require("mongoose");


const user = new Schema({
    name:String,
    username:String,
    password:String,
})

const userModel = model("User details",user)

module.exports = userModel