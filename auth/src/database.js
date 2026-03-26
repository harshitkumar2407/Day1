const { default: mongoose } = require("mongoose");


function connectDb() {
    
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('connected to MongoDB');
    })
}

module.exports = connectDb