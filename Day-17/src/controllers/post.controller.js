const postModel = require("../models/post.model")
const ImageKit = require("imagekit")
const jwt = require("jsonwebtoken")
const cookies = require("cookie-parser")


const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: "https://ik.imagekit.io/8jwf01kyk3"})



async function createPostController(req, res) {
    try {
        console.log(req.body, req.file);

        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message:"Token not provided,Unauthorised access "
            })
        }
        let decoded = null
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decoded);
        } catch (error) {
            return res.status(401).json({
                message:"User is not authoriszed"
            })
            
        }

        
        const file = await imagekit.upload({
            file: req.file.buffer,   // ✅ NO toFile
            fileName: req.file.originalname,
            folder:"cohot-2-insta-clone-post"
        });

        const post = await postModel.create({
            caption:req.body.caption,
            imgUrl: file.url,
            user: decoded.id
        })

        res.status(201).json({
            message:"POST created succssfully.",
            post
        })

        res.send(file);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Upload failed",error });
    }
}


async function getPostController(req,res) {
    
    const token = req.cookies.token()
    let decoded ;
    try {
         decoded = jwt.verify.apply(token,process.eventNames.JWT_SECRET)

    } catch (error) {
        return res.status(401).json({
            message:"Token invalild",
            error
        })
    }

    const userId = decoded.id

    const posts = await postModel.find({
        user: userId
    })
    res.status(200).json({
        message:"Posts fetched successfully.",
        posts
    })



}



async function getPostDetails(req,res) {
    // get data form cookies
    const token = req.cookies.token
    // check it have token or not 
    if (!token) {
        return res.status(401).json({
            message:"UnAuthorisex Access"
        })
    }
    // chek token is created by us or not
    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        res.status(401).json({
            message:"Invalid token"
        })
    }
    // get id of the user Id and post Id
    const userId = decoded.id
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

module.exports ={
    createPostController,
    getPostController,
    getPostDetails
}