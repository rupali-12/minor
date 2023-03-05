import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, useToast, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, {useState, useEffect} from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Stack } from '@chakra-ui/layout';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/ChatLogics';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setloggedUser] = useState();
  const {selectedChat, setSelectedChat, user, chats, setChats} =ChatState();
  const toast = useToast();

  // Fetch chats>>>>>>>>>>>
  const fetchChats=async()=>{
    try{
const config={
  headers: {
    Authorization: `Bearer ${user.token}`,
  },
};
const {data} = await axios.get("/api/chat", config);
console.log(data)
setChats(data);
    }catch(error){
     toast({
      title: "Error Occured",
      description: "Failed to Load the Chats",
      status: "error",
      duration:5000,
      isClosable:true,
      position: "bottom-left"
     })
    }
  }

   useEffect(()=>{
       setloggedUser(JSON.parse(localStorage.getItem("userInfo")));
       fetchChats();
   }, [fetchAgain]);

  return <Box
  // if chat is selected then the actual search base screen is none>> else it is flex >>
  display={{base: selectedChat ? "none": "flex", md: "flex"}}
  flexDir="column"
  alignItems="center"
  p={3}
  // bg="white"
   bg="#b0dfdf"
  w={{base:"100", md:"31%"}}
  borderRadius="lg"
  borderWidth= "1px"
  borderColor="darkblue"
  >
   <Box
    pb={3}
    px={3}
    fontSize={{base: "28px", md:"30px"}}
    // bg="#b0dfdf"
    fontWeight="semibold"
    fontFamily= "Work sans"
    display="flex"
    w="100%"
    justifyContent= "space-between"
    alignItems="center"
   >
    My Chats
    <GroupChatModal>
      <Button display="flex" fontSize={{base:"17px", md: "10px", lg:"17px"}} rightIcon={<AddIcon/>}>
      New Group Chat
    </Button>
    </GroupChatModal>
   </Box>
    {/* Render all chat users >>>> */}
    <Box
    display="flex" 
    flexDir="column"
    p={3}
    bg="#F8F8F8"
    w="100%"
    h="100%"
    borderRadius="lg"
    overflowY="hidden"
    >
      {/* if something inside the chat array then do something else display loading   */}
      {chats?(
        //  if chat is there then ,map it >>>
        <Stack overflowY='scroll'>
          {chats.map((chat)=>(
            <Box
            onClick={()=>setSelectedChat(chat)}
              cursor="pointer"
              bg={selectedChat===chat? "#38B2AC" : "#E8E8E8"}
              color={selectedChat===chat? "white": "black"}
              px={3}
              py={2}
              fontSize="2xl"
              borderRadius="lg"
              key={chat._id}
              >
                <Text>
                  {/* Checkk if a chat is not a group chat  --> in case of single chat every chat has a name of sender but in case of group chat, group name is present or shown   */}
                  {!chat.isGroupChat? getSender(loggedUser, chat.users): chat.chatName}
                </Text>
                 {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
            </Box>
          ))}
        </Stack>
      ):(
        <ChatLoading/>
      )}
    </Box>
  </Box>
};


export default MyChats


// *********************************************************************************************************************
// import { AddIcon } from "@chakra-ui/icons";
// import { Box, Stack, Text } from "@chakra-ui/layout";
// import { useToast } from "@chakra-ui/toast";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { getSender } from "../config/ChatLogics";
// import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";
// import { Button } from "@chakra-ui/react";
// import { ChatState } from "../Context/ChatProvider";

// const MyChats = ({ fetchAgain }) => {
//   const [loggedUser, setLoggedUser] = useState();

//   const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

//   const toast = useToast();

//   const fetchChats = async () => {
//     // console.log(user._id);
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };

//       const { data } = await axios.get("/api/chat", config);
//       setChats(data);
//     } catch (error) {
//       toast({
//         title: "Error Occured!",
//         description: "Failed to Load the chats",
//         status: "error",
//         duration: 5000,
//         isClosable: true,
//         position: "bottom-left",
//       });
//     }
//   };

//   useEffect(() => {
//     setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
//     fetchChats();
//     // eslint-disable-next-line
//   }, [fetchAgain]);

//   return (
//     <Box
//       d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
//       flexDir="column"
//       alignItems="center"
//       p={3}
//       bg="white"
//       w={{ base: "100%", md: "31%" }}
//       borderRadius="lg"
//       borderWidth="1px"
//     >
//       <Box
//         pb={3}
//         px={3}
//         fontSize={{ base: "28px", md: "30px" }}
//         fontFamily="Work sans"
//         d="flex"
//         w="100%"
//         justifyContent="space-between"
//         alignItems="center"
//       >
//         My Chats
//         <GroupChatModal>
//           <Button
//             d="flex"
//             fontSize={{ base: "17px", md: "10px", lg: "17px" }}
//             rightIcon={<AddIcon />}
//           >
//             New Group Chat
//           </Button>
//         </GroupChatModal>
//       </Box>
//       <Box
//         d="flex"
//         flexDir="column"
//         p={3}
//         bg="#F8F8F8"
//         w="100%"
//         h="100%"
//         borderRadius="lg"
//         overflowY="hidden"
//       >
//         {chats ? (
//           <Stack overflowY="scroll">
//             {chats.map((chat) => (
//               <Box
//                 onClick={() => setSelectedChat(chat)}
//                 cursor="pointer"
//                 bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
//                 color={selectedChat === chat ? "white" : "black"}
//                 px={3}
//                 py={2}
//                 borderRadius="lg"
//                 key={chat._id}
//               >
//                 <Text>
//                   {!chat.isGroupChat
//                     ? getSender(loggedUser, chat.users)
//                     : chat.chatName}
//                 </Text>
//                 {chat.latestMessage && (
//                   <Text fontSize="xs">
//                     <b>{chat.latestMessage.sender.name} : </b>
//                     {chat.latestMessage.content.length > 50
//                       ? chat.latestMessage.content.substring(0, 51) + "..."
//                       : chat.latestMessage.content}
//                   </Text>
//                 )}
//               </Box>
//             ))}
//           </Stack>
//         ) : (
//           <ChatLoading />
//         )}
//       </Box>
//     </Box>
//   );
// };

// export default MyChats;
