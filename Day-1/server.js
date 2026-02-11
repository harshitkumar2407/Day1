// const catMe = require("cat-me")
// import catMe from "cat-me";
// import {randomDogName, randomFemaleDogName} from 'dog-names';

// // console.log(catMe());
// console.log(randomDogName());
const express = require("express")

const app = express() // server instance areate krna
app.get('/',(req,res) => {
    res.send("Helllo world")
})
app.get('/hi',(req,res) => {
    res.send("Helllo ")
})
app.get('/hii',(req,res) => {
    res.send("nikal lode")
})
app.get('/love',(req,res) => {
    res.send("Love is a shit")
})
// hello
app.listen(3000) // server start krna