// chat schema for single chat>>>>>>
// chatName, isGroupChat, users, latestMessage, groupAdmin
const { default: mongoose } = require('mongoose')
const mongose = require('mongoose')
const chatModel=mongoose.Schema(
    {
        chatName:{type: String, trim:true},
        isGroupChat:{type:Boolean, default:false},
        // This is array bcoz single chat has single user and group chat has more that one user,  so we will reference it to that particular users.
        users: [{
            type: mongoose.Schema.Types.ObjectId,      // this will contain id of particular user 
            ref: "User",
        }],
        // This will take track of latest message
        latestMessage: {
            type: mongose.Schema.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin:{
            type: mongose.Schema.Types.ObjectId,
             ref: "User",
        }  
    },
    {
        timestamps: true,
    }
);
const Chat = mongoose.model("Chat", chatModel)
module.exports= Chat;
