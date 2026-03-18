const postModel = require("../models/post.model")
const likeModel = require("../models/like.model")
const userModel = require("../models/user.model")
const {toFile} = require("@imagekit/nodejs")
const ImageKit = require("@imagekit/nodejs")
const { default: mongoose } = require("mongoose")

function getImageKitClient() {
    return new ImageKit({
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    })
}

async function createPostController(req,res) {
    if (!req.user?.id) {
        return res.status(401).json({
            message: "User is not authorized"
        })
    }

    if (!process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
        return res.status(500).json({
            message: "Image upload service is not configured"
        })
    }

    if (!req.file?.buffer) {
        return res.status(400).json({
            message: "Image file is required"
        })
    }

    try {
        const imagekit = getImageKitClient()
        const uploaded = await imagekit.files.upload({
            file: await toFile(Buffer.from(req.file.buffer), "post-image"),
            fileName: `post-${Date.now()}`,
            folder: "cohort-2-insta-clone-posts"
        })

        const post = await postModel.create({
            caption: req.body.caption,
            imgUrl: uploaded.url,
            user: req.user.id
        })

        return res.status(201).json({
            message:"New post is created",
            post
        })
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create post",
            error: error?.message
        })
    }
}



async function getPostController(req,res) {
    
    const userId = req.user.id
    const posts = await postModel.find({
        user: userId
    })

    res.status(200).json({
        message:"Posts fetched successfully.",
        posts
    })
}



async function getPostDetails(req,res) {
    const userId = req.user.id
    const postId = req.params.postId
    // find all post by the the same post id
    const post = await postModel.findById(postId)
    // check if there is any post or not if not show errot
    if (!post) {
        return res.status(404).json({
            message:"POST not found."
        })
    }
    // 
    const isValidUser = post.user.toString() === userId

    if (!isValidUser) {
        return res.status(401).json({
            message:"Forbidden Content."
        })
    }
    return res.status(200).json({
        message:"Post fetched successfully.",
        post
    })

}

async function likePostController(req,res) {
    const {postId} = req.params
    const userId = req.user.id

    if (!userId) {
        return res.status(401).json({ message: "User is not authorized" })
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return res.status(400).json({
            message: "Invalid post ID"
        })
    }

    const post = await postModel.findById(postId)
    if(!post){
        return res.status(404).json({
            message:"Post not found"
        })
    }

    let username = req.user?.username
    if (!username) {
        const user = await userModel.findById(userId).select("username")
        username = user?.username
    }
    if (!username) {
        return res.status(400).json({ message: "Username not available" })
    }

    try {
        const like = await likeModel.create({
            post:postId,
            user:userId
        })
        return res.status(200).json({
            message:"post is liked successfully",
            like
        })
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({
                message: "Post already liked"
            })
        }
        
        return res.status(500).json({
            message: "Failed to like post",
            error: error?.message
        })
    }
}

async function getFeedController(req,res) {
    
    const user = req.user
    const posts = await Promise.all((await postModel
                        .find().populate({ path: "user", select: "-password" }))
                        .map(async (post) =>{
                            const isLiked = await likeModel.findOne({
                                user:user.username,
                                post:post._id
                            })
                             post.isLiked = isLiked
                            
                             return
                        }))

    const isLiked = await likeModel.findOne({
    user: user.id,
    post: posts._id
    })

    res.status(200).json({
        message:"posts fetched successfully.",
        posts
    })
}


module.exports ={
    createPostController,
    getPostController,
    getPostDetails,
    likePostController,
    getFeedController
}
