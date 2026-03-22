const express = require("express")
const cookie = require("cookie-parser");
const cookieParser = require("cookie-parser");


const app = express()

app.use(express.json());
app.use(cookieParser());

module.exports = app