const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
// const nodemailer = require("nodemailer");


const app = express();
const port = process.env.NODE_PORT;
const cors = require("cors");
app.use(cors());
const http = require("http").createServer(app);
// const io = require("socket.io")(http);


// If you are using Socket.IO v3, you need to explicitly enable Cross-Origin Resource Sharing (CORS).
const io = require("socket.io")(http
  , {
  cors: {
    origin:process.env.NODE_IO_HOST ,
    methods: ["GET", "POST"]
  }
}
);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require("jsonwebtoken");

mongoose
  .connect(process.env.NODE_MONGOOSE_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log("Server is running on port "+port);
  
});

const User = require("./models/user");
const Post = require("./models/post");
const Chat = require("./models/message");

//endpoint to register a user in the backend
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;
    //check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered");
      return res.status(400).json({ message: "Email already registered" });
    }

    //create a new User
    const newUser = new User({
      name,
      email,
      password,
      profileImage,
      verified: false,
      status: "",
      private: "",
      verificationToken: "", 
     
      profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png", // Add this line for the profileImage field
      connections: [], 
      connectionRequests: [], 
      sentConnectionRequests: [],
      posts: [], 

      
    });
    //generate the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the user to the database
    await newUser.save();

    //send the verification email to the registered user
    // sendVerificationEmail(newUser.email, newUser.verificationToken);

    // res.status(202).json({
    //   message:
    //     "Registration successful.Please check your mail for verification",
    // });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// const sendVerificationEmail = async (email, verificationToken) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "sujananand0@gmail.com",
//       pass: "rnzcugnscqtqiefs",
//     },
//   });

  // const mailOptions = {
  //   from: "linkedin@gmail.com",
  //   to: email,
  //   subject: "Email Verification",
  //   text: `please click the following link to verify your email : http://localhost:3000/verify/${verificationToken}`,
  // };

  //send the mail
//   try {
//     await transporter.sendMail(mailOptions);
//     console.log("Verification email sent successfully");
//   } catch (error) {
//     console.log("Error sending the verification email");
//   }
// };

//endpoint to verify email
// app.get("/verify/:token", async (req, res) => {
//   try {
//     const token = req.params.token;

//     const user = await User.findOne({ verificationToken: token });
//     if (!user) {
//       return res.status(404).json({ message: "Invalid verification token" });
//     }

//     //mark the user as verified
//     user.verified = true;
//     user.verificationToken = undefined;

//     await user.save();

//     res.status(200).json({ message: "Email verified successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Email verification failed" });
//   }
// });

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

//endpoint to login a user.
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body)
    //check if user exists already
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //check if password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey);
    console.log(token)
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

//user's profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile" });
  }
});


// to get all user
app.get("/users/:userId", async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    //fetch the logged-in user's connections
    const loggedInuser = await User.findById(loggedInUserId).populate(
      "connections",
      "_id"
    );
    if (!loggedInuser) {
      return res.status(400).json({ message: "User not found" });
    }

    //get the ID's of the connected users
    const connectedUserIds = loggedInuser.connections.map(
      (connection) => connection._id
    );

    //find the users who are not connected to the logged-in user Id
    const users = await User.find({
      _id: { $ne: loggedInUserId, $nin: connectedUserIds },
      // verified: { $eq: true },
    })
    res.status(200).json(users);
  } catch (error) {
    console.log("Error retrieving users", error);
    res.status(500).json({ message: "Error retrieving users" });
  }
});

// to get all users not only verified but all
app.get("/regusers/:userId", async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    //fetch the logged-in user's connections
    const loggedInuser = await User.findById(loggedInUserId).populate(
      "connections",
      "_id"
    );
    if (!loggedInuser) {
      return res.status(400).json({ message: "User not found" });
    }

    //get the ID's of the connected users
    const connectedUserIds = loggedInuser.connections.map(
      (connection) => connection._id
    );

    //find the users who are not connected to the logged-in user Id
    const users = await User.find({
      _id: { $ne: loggedInUserId, $nin: connectedUserIds },
      verified: { $eq: true },
    })
    res.status(200).json(users);
  } catch (error) {
    console.log("Error retrieving users", error);
    res.status(500).json({ message: "Error retrieving users" });
  }
});

//send a connection request
app.post("/connection-request", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    await User.findByIdAndUpdate(selectedUserId, {
      $push: { connectionRequests: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentConnectionRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: "Error creating connection request" });
  }
});

//endpoint to show all the connections requests
app.get("/connection-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("connectionRequests", "name email profileImage")
      .lean();

    const connectionRequests = user.connectionRequests;

    res.json(connectionRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to accept a connection request
app.post("/connection-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);


    // below line does
    // it goes to the userschema then to connections which is in User.schema
    // then updates the connections array
    sender.connections.push(recepientId);
    recepient.connections.push(senderId);

    recepient.connectionRequests = recepient.connectionRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentConnectionRequests = sender.sentConnectionRequests.filter(
      (request) => request.toString() !== recepientId.toString()
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "Friend request acccepted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to fetch all the connections of a user
app.get("/connections/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
    .populate("connections", "name profileImage createdAt")
    .exec();
     

    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }
    res.status(200).json({ connections: user.connections });
  } catch (error) {
    console.log("error fetching the connections", error);
    res.status(500).json({ message: "Error fetching the connections" });
  }
});

//endpoint to create a post
app.post("/create", async (req, res) => {
  try {
    const { description, imageUrl, userId } = req.body;

    const newPost = new Post({
      description: description,
      imageUrl: imageUrl,
      user: userId,
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.log("error creating the post", error);
    res.status(500).json({ message: "Error creating the post" });
  }
});


//endpoint to fetch all the posts
app.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profileImage");

    res.status(200).json({ posts });
  } catch (error) {
    console.log("error fetching all the posts", error);
    res.status(500).json({ message: "Error fetching all the posts" });
  }
});

//endpoints to like a post
app.post("/like/:postId/:userId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    //check if the user has already liked the post
    const existingLike = post?.likes.find(
      (like) => like.user.toString() === userId
    );

    if (existingLike) {
      post.likes = post.likes.filter((like) => like.user.toString() !== userId);
    } else {
      post.likes.push({ user: userId });
    }

    await post.save();

    res.status(200).json({ message: "Post like/unlike successfull", post });
  } catch (error) {
    console.log("error likeing a post", error);
    res.status(500).json({ message: "Error liking the post" });
  }
});

//endpoint to update user description
app.put("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { userDescription } = req.body;

    await User.findByIdAndUpdate(userId, { userDescription });

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.log("Error updating user Profile", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
});

// we are getting the creating messages 
io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      console.log("data", data);

      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();

      //emit the message to the receiver
      io.to(receiverId).emit("receiveMessage", newMessage);
    } catch (error) {
      console.log("Error handling the messages");
    }
    socket.on("disconnet", () => {
      console.log("user disconnected");
    });
  });
});

http.listen(process.env.NODE_IO_PORT, () => {
  console.log("Socket.IO server running on port "+process.env.NODE_IO_PORT);
});


// we are getting the messages
app.get("/messages", async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    console.log(senderId);
    console.log(receiverId);

    const messages = await Chat.find({
      // we are checking if this messages belonged to user and receiver and nobody else
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error in getting messages", error });
  }
});

//endpoint to delete the messages;

app.post("/delete",async(req,res) => {
  try{
      const {messages} = req.body;

      if(!Array.isArray(messages) || messages.length == 0){
          return res.status(400).json({message:"Invalid request body"})
      };

      for(const messageId of messages){
          await Chat.findByIdAndDelete(messageId);
      }

      res.status(200).json({message:"Messages delted successfully!"})
  } catch(error){
      res.status(500).json({message:"Internal server error",error})
  }
})




app.get("/search", async (req, res) => {
  try {
    const { name } = req.query;
    const regex = new RegExp(name, 'i'); // 'i' flag for case-insensitive matching
    const users = await User.find({ name: regex });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});










app.delete('/posts/:id', async (req, res) => {
  try {
      const postId = req.params.id;
      // Find the post by ID and delete it
      const deletedPost = await Post.findByIdAndDelete(postId);
      if (!deletedPost) {
          return res.status(404).json({ message: 'Post not found' });
      }
      res.json({ message: 'Post deleted successfully', deletedPost });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});








// Endpoint to update user profile
app.put('/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  const updates = req.body; // Assuming the request body contains the updated user profile data

  try {
    // Find the user by ID and update the profile
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Return the updated user profile
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});








app.get('/post/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const posts = await Post.find({ user: userId });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// app.get('/user/:userId', async (req, res) => {
//   const userId = req.params.userId;
//   try {
//     const posts = await Post.find({ user: userId }).populate('user', 'name'); // Populate the 'user' field with 'name' only
//     res.json(posts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });