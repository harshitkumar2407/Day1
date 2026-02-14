// server ko start karna
// databse se connect karna

const app = require("./src/app");

const mongoose = require("mongoose");

function connectToDB() {
    mongoose.connect("mongodb+srv://harshit:WDOaa8Ff9teA0696@cluster0.bod8ssu.mongodb.net/day-6").then(() => {
        console.log("connected to database");
    })
}

connectToDB();

app.listen(3000, (req,res)=>{
    console.log("server is running on port 3000");  
})