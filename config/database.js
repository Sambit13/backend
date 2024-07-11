const mongoose = require('mongoose');
require("dotenv").config();

exports.connect =()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(console.log("DB connection successfull"))
    .catch((error) =>{
        console.log("DB connection error");
        console.error(error);
        process.exit(1);
    })
}