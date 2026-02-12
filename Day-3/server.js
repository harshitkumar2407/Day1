const express  = require("express")

const app = express();
app.use(express.json())

const notes =[
    {
        "title":"Notes 1",
        "discritipiton":"discription of notes form servise.js"
    },
    {
        "title":"Notes 2",
        "discritipiton":"discription 2 of notes form servise.js"
    }
]

app.get("/",(req,res) => {
    console.log(req.body);
    
    res.send("hello")
})
app.post("/post",(req,res)=>{
    console.log(req.body);
    
    res.send("Post created")
})
app.post("/notes",(req,res)=>{
    console.log(req.body);
    notes.push(req.body)
    res.send("note created")
})
app.get("/notes",(req,res)=>{
    res.send(notes)
})


app.listen(3000,() => {
    console.log("Server is running on port 3000");
})