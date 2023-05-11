const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema(
    {
        start_year: {
            type: String,
        },
        end_year : {
            type: String,
        },
        added: {
            type: String,
        },
        published : {
            type: String,
        },
        sector: {
            type: String,
        },
        topic: {
            type: String,
        },
        title: {
            type: String,
        },
        insight : {
            type: String
        },
        url: {
            type: String
        },
        source: {
            type: String
        },
        impact:{
            type: String
        },
        pestle: {
            type: String
        },
        region: {
            type: String 
        },
        country: {
            type: String 
        },
        intensity : {
            type: Number 
        },
        relevance: {
            type: Number 
        },
        likelihood: {
            type: Number
        }
    }
)

const Data = mongoose.model("visualdatas", dataSchema);
module.exports = Data;