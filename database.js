const mongoose = require("mongoose");
require('dotenv').config();

const mongoDbString = process.env.DATABASE_URL;

mongoose.connect(mongoDbString, {
    dbName: "UserData"
})

const database = mongoose.connection

module.exports =  database;