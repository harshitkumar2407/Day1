const { default: mongoose } = require("mongoose");

function connectToDb() {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connect to db");
    }).catch((err)=>{
        console.log("failed to connect",err);
    }).finally(()=>{
        console.log("quarry done of running server in (database.config.js)");
    })
}

module.exports = connectToDb