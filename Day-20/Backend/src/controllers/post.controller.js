const postModel = require("../models/post.model")
const jwt = require("jsonwebtoken")
const cookies = require("cookie-parser")
const likeModel = require("../models/like.model")
const {toFile} = require("@imagekit/nodejs")
const ImageKit = require("@imagekit/nodejs")

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    // publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    // urlEndpoint: "https://ik.imagekit.io/8jwf01kyk3"
})



// async function createPostController(req, res) {
//     try {
//         console.log(req.body, req.file);

//         const userId = req.user.id;

        
//         const file = await imagekit.upload({
//             file: req.file.buffer,   // ✅ NO toFile
//             fileName: req.file.originalname,
//             folder:"cohot-2-insta-clone-post"
//         });

//         const post = await postModel.create({
//             caption:req.body.caption,
//             imgUrl: file.url,
//             user: req.user.id
//         })

//         res.status(201).json({
//             message:"POST created succssfully.",
//             post
//         })

//         res.send(file);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Upload failed",error });
//     }
// }

async function createPostController(req,res) {
    console.log(req.body,req.file);
    
   

     const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder: "cohort-2-insta-clone-posts"
    })
    res.send(file)
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
    const postId = res.params.postId
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
    return res.status(200).josn({
        message:"Post fetched successfully.",
        post
    })

}

async function likePostController(req,res) {
    const username = req.user.username
    const postId = req.params.postid
    
    const post = await postModel.findOne({postId})

    if(!post){
        return res.status(404).josn({
            message:"This post does not exist"
        })
    }

    const like = await likeModel.create({
        post:postId,
        user:username
    })
    return res.status(200).json({
        message:"post is liked successfully",like
    })
}

async function getFeedController(req,res) {
    
    const posts = await postModel.find()

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