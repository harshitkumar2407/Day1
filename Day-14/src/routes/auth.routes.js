const express = require("express")
const { registerController, loginControler } = require("../controllers/auth.controller")


const authRouter = express.Router()



authRouter.post("/register",registerController )
authRouter.post("/login",loginControler )


module.exports = authRouter