const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log("UserId params not sent with request");
        return res.sendStatus(400);
    }
    // so user should satisfies both of these conditions for chat to exist now >>>>>>>>>>>>>>>>>>>>>>>>> 
    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");

        isChat = await User.populate(isChat, {
            path: 'latestMessage.sender',
            select: "name pic email",
        });
        if(isChat.length>0){
            res.send(isChat[0]);     // this is taken index 0 only as there is no otehr chat exist with ref to that above two users
        }  
        else{
            // if not exist then create one 
            var chatData ={
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId],
            };
            try {
                const createdChat = await Chat.create(chatData);
                // Take that created chat and send it to our user >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats= asyncHandler(async(req, res)=>{
    // here we check which user is logged in and query for that user all of the chats that are in the database , And inside all of the chats we are going to search inside the chat arrays soif you consider the chat model you cans see we ahve this chat array right so we are gonna go through all of the chats in our database and we are gonna return all of the chats thata particular user is a part of..
     try{
         //  Chat.find({users:{$elemMatch:{$eq: req.user._id}}}).then((result)=>res.send(result));
         //  now i want to populate all chats from latest to oldest 
         //  Populate all the things that we return >>>
          Chat.find({users:{$elemMatch:{$eq: req.user._id}}})
             .populate("users", "-password")
             .populate("groupAdmin", "-password")
             .populate("latestMessage")
                .sort({updatedAt: -1})
               .then(async(results)=>{
                results= await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(results);
               });
     }catch(error){
        res.status(400);
        throw new Error(error.message);
     }
})

// Create createGroupChat>>>>
const createGroupChat = asyncHandler(async(req,res)=>{
    // if these not exist then fill fields>>>>>>
   if(!req.body.users || !req.body.name){
        return res.status(400).send({message: "Please Fill all the Fields"});
       }

    //    else take all users from req.body.users 
    // first need to send array in stringify format and parse in the backened 
    var users = JSON.parse(req.body.users);
    if(users.length<2){
        return res
          .status(400)
          .send("More that 2 users are reuired for Group Chat");
    }
    // this is current user that logged in 
    users.push(req.user);
     try{
        const groupChat= await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        // Now we are going to fetchthis \groupChat from our db and we are gonna send it back to our user >>>> 
        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
          .populate("users", "-password")
          .populate("groupAdmin", "-password");
          res.status(200).json(fullGroupChat);
     }catch(error){
        res.status(400);
        throw new Error(error.message);
     }
})

// This is for Rename>>>>>>>>>>
const renameGroup = asyncHandler(async(req, res)=>{
    const { chatId, chatName } = req.body;
     const updatedChat= await Chat.findByIdAndUpdate(
        chatId,   // this chat id is created for group
        {chatName},
        {new:true}      // thsi is return the new name 
     )
     .populate("users", "-password")
     .populate("groupAdmin", "-password")
     if(!updatedChat){
        res.status(404);
        throw new Error("Chat not Found");
     }
     else{
        res.json(updatedChat);
     }
});

// This is to add user to any group >>
const addToGroup = asyncHandler(async(req, res)=>{
    const {chatId, userId}= req.body;
    const added = await Chat.findByIdAndUpdate(chatId, {
        $push: {users: userId},
    }, {new:true}
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")

    if(!added){
        res.status(404);
        throw new Error("Chat not Found");
    }
    else{
        res.json(added);
    }
});


// This is to remove user frm any group>>>>
const removeFromGroup = asyncHandler(async(req, res)=>{
    const {chatId, userId}= req.body;
    const removed=await Chat.findByIdAndUpdate(chatId, {
        $pull: {users:userId}
    }, {new: true}
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    if(!removed){
        res.status(404);
        throw new Error("Chat not Found");
    }
    else{
        res.json(removed);
    }
});
module.exports= {accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup};
