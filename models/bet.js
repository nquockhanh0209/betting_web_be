const mongoose = require('mongoose')

const betSchema = new mongoose.Schema({
    matchFormat:{
        type: String,
        required: true
    },
    matchName: {
        type: String,
        required: true
    },
    matchResult: {
        type: String,
    },
    team1Name: {
        type: String,
        required: true
    },
    team1Img: {
        type: String,
        require:true
        
    },
    team2Name: {
        type: String,
        required: true
    },
    team2Img: {
        type: String,
        require:true
        
    },
    matchStartDate: {
        type: Date
    },
    matchEndDate: {
        type: Date
    },
    matchBetWinProportion: {
        type:  mongoose.Schema.Types.Decimal128,
        required: true
    },
    matchBetDrawProportion: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    matchBetLoseProportion: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    matchContract: {
        type: String,
        lowercase: true,
    },
    matchStatus: {
        type: String,
        required: true
    },
})
module.exports = mongoose.model('Bet', betSchema)