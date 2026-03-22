require("dotenv").config();
const { config } = require("dotenv");
const app = require("./src/app");
const connectToDB = require("./src/config/database");



connectToDB()
app.listen(3000,()=>{
    console.log("Server is started port 3000");
    
})