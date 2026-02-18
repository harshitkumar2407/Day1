const express = require("express")
const cors = require('cors')
const path = require('path')
const notesModel = require("./models/notes.model")

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("./public"))


app.post("/api/notes", async (req, res) => {
  try {
    const {title, discription } = req.body

    const note = await notesModel.create({title , discription })

    res.status(201).json({
      message: "New note is created",
      note
    })
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    })
  }
})

app.get("/api/notes", async(req,res)=>{
    const notes = await notesModel.find()
    res.status(200).json({
        message:"Notes Data mil gaya",notes
    })
})

app.delete("/api/notes/:id", async(req,res)=>{
    const {id} = req.params
    await notesModel.findByIdAndDelete(id)
    res.status(200).json({
        message:"Note is deleted"
    })
}) 
app.patch("/api/notes/:id", async(req,res)=>{
    const {id} = req.params
    const {discription} = req.body
    const note = await notesModel.findByIdAndUpdate(id,{discription},{new:true})
    res.status(200).json({
        message:"Note is updated",note
    })
})



app.use('*name',(req,res)=>{
  res.send("this is wild card")
  res.sendFile(path.join(__dirname,"../public/index.html"))
})



module.exports = app;