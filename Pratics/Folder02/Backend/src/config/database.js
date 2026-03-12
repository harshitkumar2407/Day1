const { default: mongoose } = require("mongoose")


async function ConnectToDb() {
    mongoose.connect("mongodb+srv://harshit:r1pyA35jac2pvqW8@cluster0.klwos4s.mongodb.net/pratics")
    .then(()=>{
        console.log('connect to database');
        
    })
}

module.exports = ConnectToDb