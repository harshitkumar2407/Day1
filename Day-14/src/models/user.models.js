const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required" ],
        unique: [true, "Username is already taken" ],
    },
    email: {
        type: String,
        required: [true, "Email is required" ],
        unique: [true, "Email is already exist" ],
    },
    password: {
        type: String,
        required: [true, "Password is required" ],
    },
    bio: {
        type: String,
    },
    profilePicture: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png",
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User