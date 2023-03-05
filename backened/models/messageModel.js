const mongoose =require("mongoose")
// This will contain name and id of sender  and content of messageModel..and reference to the chat to which itbelongs
const messageModel = mongoose.Schema({
       sender: {type:mongoose.Schema.Types.ObjectId, ref: "User"},
        content: {type:String, trim: true},
        chat: {type:mongoose.Schema.Types.ObjectId, ref: "Chat"},
},
{
    timestamps: true,
});
const Message =mongoose.model("Message", messageModel);
module.exports = Message;