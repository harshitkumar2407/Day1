const postModel = require("../models/post.model")
const ImageKit = require("imagekit")


const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: "https://ik.imagekit.io/8jwf01kyk3"})



async function createPostController(req, res) {
    try {
        console.log(req.body, req.file);

        const file = await imagekit.upload({
            file: req.file.buffer,   // ✅ NO toFile
            fileName: req.file.originalname,
        });

        res.send(file);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Upload failed" });
    }
}

module.exports ={
    createPostController
}