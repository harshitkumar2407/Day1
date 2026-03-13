const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    follower: {
        type: String,
        required: true
    },
    followee: {
        type: String,
        required: true
    },
    status:{
        type:String,
        default:"pending",
        enum:{
            values:["pending","accepted","rejected"],
            message:"status can only be pending, accepted or rejected"
        }
    }
    
},{timestamps:true})

followSchema.index({follower:1,followee:1},{unique:true})

const followModel = mongoose.model("Follow", followSchema)

module.exports = followModel