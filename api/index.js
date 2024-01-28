const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const crypto = require("crypto")
const nodemailer = require("nodemailer")

const app = express();
const port = 8080;
const cors = require("cors");
app.use(cors());

const User = require("./models/user");
const Post = require("./models/post");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/myapp" , { 
// mongoose.connect("mongodb://localhost:27017" , { 
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
}).then(() => {
    console.log("connected to mongodb");
}).catch((err) => {
    console.log("error occured", err);
})

app.listen(port, () => {
    console.log("server is running on port 8000");
})


// create endpoints for register user in backend

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne(email);
        if (existingUser) {
            console.log("user exist");
            return res.status(400).json({ message: "email is already in use" });
        }

        // create new user
        if (!existingUser) {
            const newUser = new User({
                name, email, password
            })
            await newUser.save();
            console.log(newUser);
        }

        // generate the verification token
        // newUser.verififcationToken = crypto.randomBytes(20).toString("hex");

        // save user to db
    
    } catch (error) {
        console.log("error is ", error);
        // res.status(500).json({message:"registration failed"});

    }
})

