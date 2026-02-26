const express = require("express")
const {loginController,registerController} = require("../controllers/auth.controller")  

const authRouter = express()


authRouter.post('/register', registerController)

authRouter.post("/login",loginController)


module.exports = authRouter