const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    profilePic: { type: String, default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png"},
    relation: { type: String, required: true, enum: ["Friend", "Cousine", "Uncle", "Aunt", "Unknown"], default: "Friend" },
    score: { type: Number, default: 0 },
    credits: { type: Number, default: 3 },
    createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model("User", userSchema)

module.exports = User