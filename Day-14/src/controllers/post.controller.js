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

module.exports ={
    createPostController
}