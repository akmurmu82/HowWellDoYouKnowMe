const mongoose = require("mongoose")
require("dotenv").config()
const mongoUri = process.env.MONGO_URI

const connectToDb = async () => {
    try {
        await mongoose.connect(mongoUri)
        console.log("Database connected")
    } catch (error) {
        console.log("Error while connecting to database", error)
    }

}

module.exports = connectToDb