const express = require("express")
const cors = require("cors")
const User = require("./models/userModel")
const connectToDb = require("./config/db")
require("dotenv").config()

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
            res.status(201).json({ message: "User created", newUser })
        } else {
            res.json({ message: "User already exists.", existingUser })
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

        const existingUser = await User.findOneAndUpdate({ name }, updates, { new: true, runValidators: true })
        if (!existingUser) {
            res.status(404).json({ message: "User not found!" })
        } else {
            res.status(200).json({ existingUser })
        }

    } catch (error) {
        res.status(500).json({ message: "Error occured while creating the user.", error })
        console.log(error)
    }
})

app.listen(port, async () => {
    try {
        await connectToDb()
        console.log("server is up and running")
    } catch (error) {
        console.log("something went wrong", error)
    }
})