const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    profilePic: { type: String, default: "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Image.png" },
    relation: { type: String, required: true, enum: ["Sibling", "Friend", "Cousine", "Uncle", "Aunt", "Niece", "Nephew", "Unknown", "Admin"], default: "Friend" },
    score: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 999 },
    credits: { type: Number, default: 3 }
}, { timestamps: true }); // This enables createdAt and updatedAt fields

const User = mongoose.model("User", userSchema)

module.exports = User