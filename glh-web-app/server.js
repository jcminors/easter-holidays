require("dotenv").config(); //.env file connection for mongo db

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt"); //password encryption tool
const User = require("./models/User"); //user.js
const app = express(); // connect express

app.use(express.json());
app.use(cors());
app.use(express.static("OSP"));

// connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to database"); // database connection successful - proceeded
  })
  .catch((err) => {
    console.log("Database error:", err); //something went wrong
  });

// signup page
app.post("/signup", async (req, res) => {

  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    if (!username || !email || !password) {
      res.status(400).json({ message: "Missing fields" }); //requires user to input into each field
      return;
    }

    const userExists = await User.findOne({ email: email }); //checks for email within database

    if (userExists) {
      res.status(400).json({ message: "User already exists" }); //to prevent making more than one account with one email
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10); //hashes password for security

    const newUser = new User({ //sets up new user account once sign up information is recieved
      username: username,
      email: email,
      password: hashedPassword,
      loyaltyPoints: 0 //sets loyalty points to zero for new accounts
    });

    await newUser.save(); //saves all the data so the account can now be logged into

    res.json({ message: "Signup successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" }); //error message
  }

});

// login path
app.post("/login", async (req, res) => {

  try {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      res.status(400).json({ message: "Missing fields" }); //checks if both fields have inputs in them
      return;
    }

    const user = await User.findOne({ email: email }); //checks for user

    if (!user) {
      res.status(400).json({ message: "User not found" }); //no email = no account, not found
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(400).json({ message: "Incorrect password" }); //wrong password denies access to the account
      return;
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        loyaltyPoints: user.loyaltyPoints //retrieves all of the users data from database
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" }); //error message
  }

});

// start server
app.listen(3000, function () {
  console.log("Server running on port 3000"); //port 3000 github / visual studio code
});

//RESTART SERVER =------------------------------
// cd glh-web-app
// node server.js
//should restart the server and connect to port 3000