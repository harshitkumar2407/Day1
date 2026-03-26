require("dotenv").config()
const app = require("./src/app");
const connectDb = require("./src/database");


connectDb()

app.listen(3000,()=>{
    console.log('Serve is runnig on port 3000');
    
})