const express = require("express")
const { registerController, loginController, getMeController } = require("../controllers/auth.controller")
const identifyUser = require("../middleware/auth.middleware")


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

/**
*  @route GET /api/auth/get-me
*  @name Get me
*  @description Get the currently  logged in user's information
*  @access Public
*/
authRouter.get("/get-me",identifyUser,getMeController)



module.exports = authRouter