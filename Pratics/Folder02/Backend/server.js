require('dotenv').config()
const app = require("./src/app")
const ConnectToDb = require("./src/config/database")


ConnectToDb()

app.listen(3000,()=>{
    console.log("Server running")
})