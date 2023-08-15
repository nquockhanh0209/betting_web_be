require('dotenv').config()
const axios = require('axios')
const express = require('express')
const cors = require("cors");
const app = express()
const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/betting", {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to Database"))
app.use(cors());
app.use(express.json())
const router = require('./routes/matchInfo')
app.use('/matchInfo', router)
const endMatch = require('./routes/match-result')
app.use('/match-result', endMatch)
app.listen(3000, () => console.log("Server started"))

