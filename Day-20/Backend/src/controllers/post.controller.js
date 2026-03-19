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
    // populate help us to find the detial of the user tooo
    const post = await postModel.findById(postId).populate("user");
    // check if there is any post or not if not show errot
    if (!post) {
        return res.status(404).json({
            message:"POST not found."
        })
    }
    // 
    // const isValidUser = post.user.toString() === userId;

    // if (!isValidUser) {
    //     return res.status(401).json({
    //         message:"Forbidden Content."
    //     })
    // }
    return res.status(200).json({
        message:"Post fetched successfully.",
        post
    })

}

async function likePostController(req,res) {
    const postId = req.params.postId
    const userId = req.user.id

    const post = await postModel.findById(postId)

    const like = await likeModel.create({
        post:postId,
        user:userId
    })
    
    res.status(200).json({
        message: "Post liked successfully.",
        like
    })
    
}

async function unlikePostController(req,res) {
    const postId = req.params.postId
    const userId = req.user.id

    const isLiked = await likeModel.findOne({
        post:postId,
        user:userId
    })
    if (!isLiked) {
        return res.status(400).json({
            message:"Post did't like"
        })
    }

    await likeModel.findOneAndDelete({ _id: isLiked._id})

    return res.status(200).json({
        message:"Post unliked Successfully"
    })
}



async function getFeedController(req, res) {

    const user = req.user

    const posts = await Promise.all((await postModel.find({}).sort({_id:-1}).populate("user").lean())
        .map(async (post) => {
            const isLiked = await likeModel.findOne({
                user: user.id,
                post: post._id
            })

            post.isLiked = Boolean(isLiked)

            return post
        }))



    res.status(200).json({
        message: "posts fetched successfully.",
        posts
    })
}


module.exports ={
    createPostController,
    getPostController,
    getPostDetails,
    likePostController,
    getFeedController,
    unlikePostController
}
