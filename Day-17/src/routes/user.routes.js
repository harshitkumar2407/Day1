const express = require("express")
const userController = require("../controllers/user.controller");
const identifyUser = require("../middleware/auth.middleware");
const userRouter = express.Router();

/**
*  @route POST /api/users/follow/:userId
*  @name FollowUser
*  @description Follow a user
*  @access Private
*/

userRouter.post("/follow/:username",identifyUser,userController.followUserController)


/**
*  @route POST /api/user/unfollow/:username
*  @name unfollow User
*  @description Unfollow the user
*  @access http://localhost:3000/user/unfollow/:username
*/


userRouter.post("/unfollow/:username",identifyUser,userController.unfollowUserController)





module.exports = userRouter;