const express = require("express")
const postRouter =  express.Router()
const { createPostController, getPostController, getPostDetails, likePostController, getFeedController } = require("../controllers/post.controller")
const multer = require("multer")
const identifyUser = require("../middleware/auth.middleware")
const upload = multer({ storage: multer.memoryStorage() })


// POST /api/posts/
// req.body = {caption, image-file}
// 
postRouter.post("/",upload.single("image"),identifyUser,createPostController)

/**
*  @route GET /api/posts/ []
*  @name post Controller
*  @description get data of post
*  @access Private
*/

postRouter.get("/",identifyUser,getPostController)

/**
*  @route Get /api/posts/details/:postId
*  @name Get Post Details
*  @description Get all the info related the the post with the help of post
*  @access Private
*/
postRouter.get("/details/:postId",identifyUser,getPostDetails)


/**
*  @route POST /api/posts/like/:postid
*  @name Like 
*  @description Like the post 
*  @access Private
*/
postRouter.post("/like/:postid",identifyUser,likePostController)

/**
*  @route GET /api/post/feed
*  @name 
*  @description get all the post created in the D
*  @access Public
*/
postRouter.get("/feed",identifyUser,getFeedController)

module.exports = postRouter
