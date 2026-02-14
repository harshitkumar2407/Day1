const express = require("express")

const app = express()

app.use(express.json())


const notes = []
// POST /notes
app.post("/notes",(req,res)=>{
    console.log(req.body)
    notes.push(req.body)
    
    res.status(201).json({
        message: "Note created successfully "
    })
})

// GIT/notes
app.get("/notes",(req,res)=>{
    res.status(200).json({
        notes:notes
    })
})

// DELETE 

// app.delete("/notes/:harshit",(req,res)=>{
//     delete notes[req.notes.harshit]

//     res.status(200).json({
//         message: "Notes deleted successfully."
//     })
// })
app.delete("/notes/:harshit", (req, res) => {
    const index = Number(req.params.harshit)

    if (!notes[index]) {
        return res.status(404).json({
            message: "Note not found (sad)"
        })
    }

    notes.splice(index, 1)

    res.status(200).json({
        message: "Note deleted successfully",
        notes: notes
    })
})

// Detete discription

// app.patch("/notes/:index" , (req,res)=>{
//     notes[req.params.index].description = req.body.description
//     res.status(200).json({
//         message:"Notes updated successfully"
//     })
// })
app.patch("/notes/:index", (req, res) => {
    const index = Number(req.params.index)

    if (!notes[index]) {
        return res.status(404).json({
            message: "Note not found"
        })
    }

    notes[index].description = req.body.description

    res.status(200).json({
        message: "Note updated successfully",
        note: notes[index]
    })
})


module.exports = app