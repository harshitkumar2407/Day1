// server ko start kerna 
// database se connect
require("dotenv").config()
const app = require("./src/app")
const mongoose = require("mongoose")
const connectToDb = require("./src/config/database")


connectToDb();


app.get("/", (req, res) => {
  res.send("Working");
});

app.listen(3000, ()=>{
    console.log("Server is running port 3000");
    
})