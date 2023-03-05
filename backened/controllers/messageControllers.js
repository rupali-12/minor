const asynHandler= require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const Message= require('../models/messageModel');
const sendMessage= asynHandler(async(req, res)=>{
    //   It takes three things like the chat id we are supposed to sed the MessageChannel, message itself, third is who is the sender of the message,

    const {content, chatId}=req.body
    if(!content|| !chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }
    var newMessage ={
        sender: req.user._id,
        content: content,
        chat: chatId,
    }
    // Query our databse>>
    try{
        var message=  await Message.create(newMessage);
        // Here we are trying to populate the sender with name and pic ..since this is not directly been populated  so if this was directly getting populated inside of a query we would have used just the populate  but we are populating the instance of mongoose class 

        // populate the user>>>>.
        message = await message.populate("sender", "name pic");
        // populate the chat>>>>
        message = await message.populate("chat");

        // Populate each of the user from the list of users >>>>>>>>>>>>
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        })
        res.json(message);
    }catch(error){
        res.status(400);
       throw new Error(error.message);
    }
 });

const allMessages = asynHandler(async(req, res)=>{
    // Fetch all messages for a particular chat >>>>>>>>>>>>>
    try{
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = {sendMessage, allMessages};