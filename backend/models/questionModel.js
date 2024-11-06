const mongoose = require("mongoose")

const questionSchema = mongoose.Schema({
    title: { type: String, required: true, unique: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
})

const Question = mongoose.model("question", questionSchema)

module.exports = Question