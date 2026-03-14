const express = require("express")
const { registerController, loginController } = require("../controllers/auth.controller")


const authRouter = express.Router()

/**
*  @route POST /api/auth/register
*  @name Register User
*  @description Register a new user
*  @access Public
*/
authRouter.post("/register",registerController )

/**
*  @route POST /api/auth/login
*  @name Longin
*  @description Long in the user
*  @access Private
*/
authRouter.post("/login",loginController )


module.exports = authRouter