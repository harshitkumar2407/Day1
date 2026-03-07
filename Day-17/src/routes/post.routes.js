const express = require("express")
const postRouter =  express.Router()
const { createPostController, getPostController, getPostDetails } = require("../controllers/post.controller")
const multer = require("multer")
const upload = multer({ storage: multer.memoryStorage() })


// POST /api/posts/
// req.body = {caption, image-file}
// 
postRouter.post("/",upload.single("image"),createPostController)


postRouter.get("/",getPostController)
// git/apiposts/ details/:postid
// return an detail about specifice post  with the id. also check whether the psot blong to the user that request come form from

postRouter.get("/details/:postId",getPostDetails)

module.exports = postRouter
