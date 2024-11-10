const express = require("express")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const User = require("./models/userModel")
const connectToDb = require("./config/db")
const Question = require("./models/questionModel")
require("dotenv").config()
const cron = require('node-cron');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in the "uploads" folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage })

// Resetting credits of all the users back to 3 at midnight
cron.schedule('0 */6 * * *', async () => {
    try {
        await User.updateMany({}, { $set: { credits: 3 } });
        console.log("Credits reset to 3 for all users");
    } catch (error) {
        console.error("Error resetting credits:", error);
    }
});

const port = process.env.PORT
const beBaseUrl = process.env.BE_BASE_URL

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use("/uploads", express.static("uploads"));

// Home route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the server." })
})

// Register route
app.post("/register", async (req, res) => {
    try {
        const { name, email, relation } = req.body
        const existingUser = await User.findOne({ name })
        // console.log({ name, email, relation })
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
app.patch("/update", upload.single("profilePic"), async (req, res) => {
    try {
        const { name, ...updates } = req.body
        console.log("res.body:", req.body)

        // If a file is uploaded, set the profilePic path
        if (req.file) {
            updates.profilePic = `${beBaseUrl}/uploads/${req.file.filename}`; // Store the file path
        }

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

// Route to get 20 random questions
app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.aggregate([{ $sample: { size: 20 } }]); // Fetch 20 random questions
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