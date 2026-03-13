const mongoose = require("mongoose")

const followSchema = new mongoose.Schema({
    follower: {
        type: String,
        required: true
    },
    followee: {
        type: String,
        required: true
    }
},{timestamps:true})

followSchema.index({follower:1,followee:1},{unique:true})

const followModel = mongoose.model("Follow", followSchema)

module.exports = followModel