const express = require("express")
const app = express();
app.use(express.json())
const notesModel = require("./models/notes.model")

app.post("/api/notes",async(req,res)=>{
    const {discription} = req.body

    const note = await notesModel.create({
        discription
    })
    res.status(201).json({
        message:"new node is created ",note
    })
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
// update the note
// /api/notes/:id
// req.body => {discription}
app.patch("/api/notes/:id", async(req,res)=>{
    const {id} = req.params
    const {discription} = req.body
    const note = await notesModel.findByIdAndUpdate(id,{discription},{new:true})
    res.status(200).json({
        message:"Note is updated",note
    })
})




module.exports = app;