const express = require("express")
const postRouter =  express.Router()
const { createPostController, getPostController, getPostDetails, likePostController, getFeedController,unlikePostController } = require("../controllers/post.controller")
const identifyUser = require("../middleware/auth.middleware")

// for uploading image in post we will use multer package to handle multipart/form-data which is used for uploading files. We will use memory storage to store the uploaded file in memory as a buffer, which can be processed further before saving it to the database or cloud storage.
//hum melter ka use karenge image upload karne ke liye, multer ek middleware hai jo multipart/form-data ko handle karta hai, jo file upload ke liye use hota hai. Hum memory storage ka use karenge jisme uploaded file ko memory mein buffer ke roop mein store kiya jata hai, jise aage process karke database ya cloud storage mein save kiya ja sakta hai.
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })


// POST /api/posts/
// req.body = {caption, image-file}
// 
postRouter.post("/",identifyUser,upload.single("image"),createPostController)

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
postRouter.post("/like/:postId",identifyUser,likePostController)
postRouter.post("/unlike/:postId",identifyUser,unlikePostController)

/**
*  @route GET /api/post/feed
*  @name Get All post
*  @description get all the post created in the D
*  @access Public
*/
postRouter.get("/feed",identifyUser,getFeedController)

module.exports = postRouter
