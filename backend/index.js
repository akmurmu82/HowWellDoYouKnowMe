const express = require("express")
const cors = require("cors")
const User = require("./models/userModel")
const connectToDb = require("./config/db")
const Question = require("./models/questionModel")
require("dotenv").config()
const cron = require('node-cron');

// Resetting credits of all the users back to 3 at midnight
cron.schedule('*/2 * * * *', async () => {
    try {
        await Player.updateMany({}, { $set: { credits: 3 } });
        console.log("Credits reset to 3 for all users");
    } catch (error) {
        console.error("Error resetting credits:", error);
    }
});


const port = process.env.PORT

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())

// Home route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the server." })
})

// Register route
app.post("/register", async (req, res) => {
    try {
        const { name, email, relation } = req.body

        const existingUser = await User.findOne({ name })
        if (!existingUser) {
            const newUser = new User({ name, email, relation })
            await newUser.save()
            res.status(201).json({ message: "User created", user: newUser })
        } else {
            res.json({ message: "User already exists.", user: existingUser })
        }

    } catch (error) {
        res.status(500).json({ message: "Error occured while creating the user.", error })
        console.log(error)
    }
})

// Update route
app.patch("/update", async (req, res) => {
    try {
        const { name, ...updates } = req.body
        console.log("res.body:", res.body)

        const existingUser = await User.findOneAndUpdate({ name }, updates, { new: true, runValidators: true })
        if (!existingUser) {
            res.status(404).json({ message: "User not found!" })
        } else {
            console.log("existingUser:", existingUser)
            res.status(200).json({ message: "User updated", user: existingUser })
        }

    } catch (error) {
        res.status(500).json({ message: "Error occured while creating the user.", error })
        console.log(error)
    }
})

// Route to get all questions
app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find(); // Fetch all questions from the database
        res.status(200).json(questions); // Send back the questions as a JSON response
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Internal server error' }); // Handle errors
    }
});

// Route to get all questions
app.get('/players', async (req, res) => {
    try {
        const players = await User.find().sort({ score: -1 }); // Fetch all players from the database
        res.status(200).json(players); // Send back the players as a JSON response
    } catch (error) {
        console.error('Error fetching players:', error);
        res.status(500).json({ message: 'Internal server error' }); // Handle errors
    }
});

app.listen(port, async () => {
    try {
        await connectToDb()
        console.log("server is up and running")
    } catch (error) {
        console.log("something went wrong", error)
    }
})