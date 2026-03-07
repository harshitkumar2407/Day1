require('dotenv').config()
// DAY -8
const express = require("express");
const userModel = require("./models/notes.model");
const authRouter = require("./routes/auth.routes")

const app = express();

app.use(express.json())
app.use("/api",authRouter)

// app.use('*name',(req,res)=>{
//     res.send("this is whild card")
//     res.sendFile(this.path.join(__dirname, ""))
// })

module.exports = app