const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
    title: String,
    discription: String
});

const notesModel = mongoose.model("Note", noteSchema);

module.exports = notesModel;