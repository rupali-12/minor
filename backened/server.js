const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const colors = require("colors");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const path = require("path");

dotenv.config();
const PORT = process.env.PORT || 5000;
// app.get("/", (req, res)=>{res.send("I m live")});

app.use(cors({ credentials: true, origin: "http://localhost:5001" }));
// app.use(cors({credentials: true, origin:"https://gorgeous-zabaione-0b8dad.netlify.app"}));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// // ---------------------------Deployment ---------------------------------------------

const __dirname1 = path.resolve();
// const __dirname1= "/minorProject";
console.log(__dirname1);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "./frontend/build")));

  // here i m going to get the content inside the indexedDB.html
  app.get("*", (req, res) => {
    // i wanna send this file to our frontend when our app is successfully running
    // we wanna run our index.html which will be inside of our build folder
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running successfully");
  });
}

// // ---------------------------Deployment ---------------------------------------------
app.use(notFound);
app.use(errorHandler);

// const start =async()=>{
// try{
//     await connectDB();
//     app.listen(PORT, ()=>{
//         console.log(`Server started on port ${PORT}`.yellow.bold)
//     })
// }catch(error){
//     console.log(error)
// }
// }
// start()

connectDB();
const server = app.listen(
  5000,
  console.log(`Server Started on PORT ${PORT}`.yellow.bold)
);
const io = require("socket.io")(server, {
  // pingTimeout is the amount of time it will wait while being inactive>>>>>
  // It takes 60 sec before it goes off so lets say if for 60 seconds any user didn't send any message so it closes connection to save the bandwidth
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5001",
    // origin: "https://gorgeous-zabaione-0b8dad.netlify.app/",
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  // Here we created another socket wherethe front end will send some data and will join a room >>>>
  socket.on("setup", (userData) => {
    socket.join(userData._id);

    //  console.log(userData._id);

    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    //    We want message to be emitted to all the users except us >>>>>>>>>>>>>>>>>>>>>>>
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      // otherwise when it compares with other user then it will sent this >>>>>>
      socket.in(user._id).emit("message received", newMessageRecieved);
      // socket.in(chat._id).emit("message received", newMessageRecieved);
    });
  });

  // clean up the socket after we r done>>>>>>>>>>>
  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  });
});

// token for vina>>>>>>>
//  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzYmMyOGY2MWRhOGNhMDcxOGNiZWMzNCIsImlhdCI6MTY3MzI3ODY5MSwiZXhwIjoxNjc1ODcwNjkxfQ.dvk1MtXFF86jsJZGt02tbUc2X7T2FsUVIdSFi10m2nY
