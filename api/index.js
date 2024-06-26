const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();



const app = express();
const port = process.env.NODE_PORT;
const cors = require("cors");
app.use(cors());
const http = require("http").createServer(app);

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

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered");
      return res.status(400).json({ message: "Email already registered" });
    }

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
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    await newUser.save();

  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Registration failed" });
  }
});



const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

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


app.get("/users/:userId", async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    const loggedInuser = await User.findById(loggedInUserId).populate(
      "connections",
      "_id"
    );
    if (!loggedInuser) {
      return res.status(400).json({ message: "User not found" });
    }

    const connectedUserIds = loggedInuser.connections.map(
      (connection) => connection._id
    );

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

app.get("/regusers/:userId", async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    const loggedInuser = await User.findById(loggedInUserId).populate(
      "connections",
      "_id"
    );
    if (!loggedInuser) {
      return res.status(400).json({ message: "User not found" });
    }

    const connectedUserIds = loggedInuser.connections.map(
      (connection) => connection._id
    );

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

app.post("/connection-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);


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


app.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profileImage");

    res.status(200).json({ posts });
  } catch (error) {
    console.log("error fetching all the posts", error);
    res.status(500).json({ message: "Error fetching all the posts" });
  }
});

app.post("/like/:postId/:userId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

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

app.put("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, bio, branch, alumni, passoutYear, year } = req.body;
    await User.findByIdAndUpdate(userId, { name, bio, branch, alumni, passoutYear, year });
    const updatedUser = await User.findById(userId);
    res.status(200).json({ message: "User profile updated successfully", user: updatedUser });
  } catch (error) {
    console.log("Error updating user profile", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
});
io.on("connection", (socket) => {
  console.log("a user is connected");

  socket.on("sendMessage", async (data) => {
    try {
      const { senderId, receiverId, message } = data;

      console.log("data", data);

      const newMessage = new Chat({ senderId, receiverId, message });
      await newMessage.save();

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


app.get("/messages", async (req, res) => {
  try {
    const { senderId, receiverId } = req.query;

    console.log(senderId);
    console.log(receiverId);

    const messages = await Chat.find({
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
  const updates = req.body; 

  try {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); 
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


app.get('/users', async (req, res) => {
  try {
    const users = await User.find({ status: { $eq: 'unblocked' } });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post("/regteacher", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered");
      return res.status(400).json({ message: "Email already registered" });
    }

    const newUser = new User({
      email,
      password,
      verified: true, 
      name: "", 
      profileImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/510px-Default_pfp.svg.png", // Add profileImage field with default value
      status: "",
      private: "",
      verificationToken: "",
      connections: [],
      connectionRequests: [],
      sentConnectionRequests: [],
      posts: [],
    });

    await newUser.save();
    console.log(newUser.verified);

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Registration failed" });
  }
});
app.get('/alumsearch', async (req, res) => {
  const { name, alumni, passout, branch } = req.query;

  try {
    let query = {};

    if (name) {
      query.name = { $regex: new RegExp(name, 'i') };
    }
    if (alumni) {
      query.alumni = alumni === 'true';
    }
    if (passout) {
      query.passoutYear = passout.toString(); 
    }
    if (branch) {
      query.branch = branch;
    }

    const results = await User.find(query);
    res.json(results);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
});