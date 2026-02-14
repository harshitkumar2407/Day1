const express = require("express")

const app = express()

app.use(express.json)

app.get("/",(req,res)=>{
    req.send("hello world")
})

app.push("/notes",(req,res)=>{
    res.push(req.body)
})
app.delete("/notes/:index",(req,res)=>{
    delete notes[req.params.index]
})

app.patch("/notes/:index",(req,res)=>{
    notes[ req.params.index ].description = req.body.description
    
})
