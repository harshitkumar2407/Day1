// server ko create kerna

const express = require("express")
const noteModel = require("./models/notes.model")
const app = express()
app.use(express.json());
// POST /notes
// req.body => {title,dexcription}

app.post("/notes",async (req,res)=>{
    try {
        const {title,description,age} = req.body

    const note = await noteModel.create({
        title,description,age
    })

    res.status(201).json({
        message:"Note created successfully",note
    })
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
})



module.exports = app;