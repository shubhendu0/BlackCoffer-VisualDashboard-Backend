const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
    }
    catch(err){
        return console.log(err);
    }
}
module.exports = connectDB;