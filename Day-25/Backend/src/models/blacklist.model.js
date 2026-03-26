
const mongoose = require("mongoose")

const backlistSchema = new mongoose.Schema({
    token:{
        type:String,
        required:[true,"token is required for blacklisting."]
    }},{
        timestamps: true
    }
)

const blacklistModel = mongoose.model("blacklist",backlistSchema)

module.exports = blacklistModel