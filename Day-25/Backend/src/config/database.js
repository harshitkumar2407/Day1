const mongoose = require("mongoose")

function connectToDb() {
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Database is connected');
    }).catch(err =>{
        console.log("Error connecting to DB", err);
        
    })
}


module.exports = connectToDb;