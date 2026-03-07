const { default: mongoose, model } = require("mongoose");

async function ConnectToDb(req,res) {
    await mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to database");
    })
    .catch((Error)=>{
        console.error("Did not conneted to database",Error);
    })
}

module.exports = ConnectToDb