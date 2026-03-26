require("dotenv").config()
const app = require( "../Backend/src/app")
const connectToDb = require("../Backend/src/config/database")



connectToDb()

app.listen(3000, ()=>{
    console.log("Server is running on post 3000");
    
})