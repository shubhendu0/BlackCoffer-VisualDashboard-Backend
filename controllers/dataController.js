const Data = require('../models/dataModel');


const addData = async(req, res) => {
    let data = new Data(req.body);
    let result = await data.save();
    if(result){
        res.status(200).json(result);            
    }
    else{
        res.status(400).json({message : "Couldn't add data provided"});
    }       
}


const getAllData = async(req, res) => {
    const allData = await Data.find();
    if(allData.length > 0){
        return res.status(200).send(allData);
    }
    else{
        return res.status(400).json({message : "No Data Found"})
    }
}


const filterRegion= async(req, res) => {
    const data = await Data.find({region : req.params.key});
    if(data.length > 0){
        return res.status(200).send(data);
    }
    else{
        return res.status(400).json({message : "No Data Found"})
    }        
}


const filterCountry= async(req, res) => {
    const data = await Data.find({country : req.params.key});
    if(data.length > 0){
        return res.status(200).send(data);
    }
    else{
        return res.status(400).json({message : "No Data Found"})
    }
}


const filterCity= async(req, res) => {
    const data = await Data.find({city : req.params.key});
    if(data.length > 0){
        return res.status(200).send(data);
    }
    else{
        return res.status(400).json({message : "No Data Found"})
    }
}


const filterSector= async(req, res) => {
    const data = await Data.find({sector : req.params.key});
    if(data.length > 0){
        return res.status(200).send(data);
    }
    else{
        return res.status(400).json({message : "No Data Found"})
    }
}


const filterTopic= async(req, res) => {
    const data = await Data.find({topic : req.params.key});
    if(data.length > 0){
        return res.status(200).send(data);
    }
    else{
        return res.status(400).json({message : "No Data Found"})
    }
}


module.exports = {
    getAllData,
    addData,
    filterRegion,
    filterCountry,
    filterCity,
    filterSector,
    filterTopic
}