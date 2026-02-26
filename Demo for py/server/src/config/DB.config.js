const { default: mongoose } = require("mongoose");

function connectToDB() {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to DB");
    })
    .catch(err =>{
        console.log("Connection Failed",err);
    }).finally(()=>{
        console.log("quarry is complete");
        
    })
}
module.exports = connectToDB