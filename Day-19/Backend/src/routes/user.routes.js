const express = require("express")
const userRouter = express.Router();
const userController = require("../controllers/user.controller");
const identifyUser = require("../middleware/auth.middleware");

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
*  @access http://localhost:3000/api/user/unfollow/:username
*/
userRouter.post("/unfollow/:username",identifyUser,userController.unfollowUserController)

/**
*  @route GET /api/user/follower/list
*  @name 
*  @description 
*  @access http://localhost:3000/api/user/follower/list
*/
userRouter.get("/follower/list",identifyUser,userController.getFollowerListController)


userRouter.get("/following/list",identifyUser,userController.getFollowingListController)


userRouter.post("/accept/request/:username",identifyUser,userController.acceptRequest)






module.exports = userRouter;