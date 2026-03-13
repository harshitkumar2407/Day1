const express = require("express")
const postRouter =  express.Router()
const { createPostController, getPostController, getPostDetails } = require("../controllers/post.controller")
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
*  @description get daata of post
*  @access http://localhost:3000/api/posts
*/

postRouter.get("/",identifyUser,getPostController)
// git/apiPosts/ details/:postId
// return an detail about specifice post  with the id. also check whether the post blong to the user that request come form from

postRouter.get("/details/:postId",identifyUser,getPostDetails)




module.exports = postRouter
