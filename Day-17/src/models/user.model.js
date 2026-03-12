const { default: mongoose } = require("mongoose");


const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true,"User name already exists"],
        required:[true,"User name is required"]
    },
    email:{
        type:String,
        unique:[true,"Email already exists"],
        required:[true,"Email is required"]
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    bio: String,
    profileImage:{
        type:String,
        default:"https://i.pinimg.com/736x/82/85/96/828596ef925a10e8c1a76d3a3be1d3e5.jpg"
    },
    followers: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }],
    following: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }]
})

const userModel = mongoose.model("users",userSchema)

module.exports = userModel;