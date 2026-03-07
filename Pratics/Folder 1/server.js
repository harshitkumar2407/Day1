const app = require("./src/app");
const ConnectToDb = require("./src/config/database");


ConnectToDb();

app.get("/", (req,res) =>{
    res.send("It is working")
})

app.listen(3000,()=>{
    console.log("Server is connected");
    
})