// import React from 'react'
// import { ChatState } from '../Context/ChatProvider';
// import {Box} from '@chakra-ui/react';
// import SingleChat from './SingleChat'

// const Chatbox = ({fetchAgain, setFetchAgain}) => {
//   const{selectedChat} = ChatState();
//   return(<Box d={{base: selectedChat? "flex":"none", md: "flex"}}
//   alignItems="center"
//   flexDir="column"
//   p={3}
//   // bg="#0a6969"
//   bg="#b0dfdf"
//   w={{base: "100%", md:"68%"}}
//   // color="white"
//   borderRadius="lg"
//   borderWidth="1px"
//   fontWeight="semibold"
//   borderColor="darkblue">
  
//   <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>

//   </Box>
//   )
// }

// export default Chatbox;

// ******************************************************************************************************************
import { Box } from "@chakra-ui/layout";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      // bg="white"
      bg="#b0dfdf"
      fontWeight="semibold"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default Chatbox;
