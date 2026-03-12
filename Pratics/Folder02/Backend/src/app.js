const express = require("express")
const userModel = require("./models/user.model")
const authRouter = require("./routes/auth.routes")
const cookieParser = require("cookie-parser")



const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api",authRouter)


module.exports = app