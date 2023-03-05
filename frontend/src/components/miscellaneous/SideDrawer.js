import { Button, Tooltip,Menu,Input, MenuButton, MenuList, MenuItem, MenuDivider, useDisclosure, useToast, Spinner } from '@chakra-ui/react';
import React, {useState} from 'react'
import { Box, Text} from "@chakra-ui/layout";
import { ChevronDownIcon} from "@chakra-ui/icons";
import { Avatar } from '@chakra-ui/avatar';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import {Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay} from "@chakra-ui/modal"
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../userAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
// import NotificationBadge from 'react-notification-badge';
// import { Effect } from 'react-notification-badge';
// import { BellIcon } from 'react-bell-icon';
import '../styles.css'


const SideDrawer = () => {
  const [search,  setSearch]=useState("");
  const [searchResult, setSearchResult]= useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] =useState();
  const {user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState();
  const history = useHistory();
  const {isOpen, onOpen, onClose}= useDisclosure();

  const toast =useToast();
  // Logout Handler >>>
  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    history.push("/");
  }

  const handleSearch= async()=>{
    // This will search if there is anything inside this search bar >>>>>
    // If not then give error 
    if(!search){ 
     toast({
        title: "Please Enter Something to Search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left"
     });
     return;
    }
    // Give a api call to search the user >>>>
    try{
      setLoading(true)
      const config ={
        headers: {
          Authorization:`Bearer ${user.token}`,
        }
      }

      // Take this config and put inside the axios call >>>>
      const {data} = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    }catch(error){
     toast({
      title: "Error Occured!",
      description: "Failed to Load the Search Results",
      status: "error",
      isClosable: true,
      duration: 5000,
      position: "bottom-left",
     })
    }
  };

  const accessChat= async(userId)=>{
   try{
     setLoadingChat(true)
     const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
     };
    //  Here we are make it a api request >>>
    // It will return a chat that is created 
    const {data} = await axios.post('/api/chat', {userId}, config);

    // If chat is already inside of this chats state which we are fetching inside of mychats so what we want to do we want to append it  
    if(!chats.find((c)=>c._id===data._id)) setChats([data, ...chats]);

    setSelectedChat(data);
    setLoadingChat(false);
    onClose();
    }catch(error){
       toast({
        title: "Error in Fetching the Chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left"
       });
   }
  };

  return (
 <>
  <Box
  display="flex"
  justifyContent="space-between"
  alignItems="center"
  bg="white"
  w="100%"
  p="5px 10px 5px 10px"
  borderWidth="5px"
  borderColor="darkblue"
  >
    <Tooltip label= "Search Users to Chat"
     hasArrow
     placement="bottom-end"
     >
     <Button variant="ghost" onClick={onOpen}>
     <i className="fas fa-search"></i>
      <Text display={{base:"none", md: "flex"}} px="4">Search User</Text>
     </Button>
    </Tooltip>
    <Text fontSize="3xl" fontFamily="work sans" fontWeight="bold">Cackle</Text>
    <div>

{/* from ${getSender(user, notifi.chat.chatName)} */}

      <Menu>
        <MenuButton p={1}>
          {/* <NotificationBadge
          count = {notification.length}
          effect = {Effect.SCALE}
          />
          <i className="fa-solid fa-bell"></i>
          <BellIcon fontSize="2xl" m={1}/> */}
 
<div> 
  <div className='bell-notification' current-count={notification.length}>
  <i className="fa-solid fa-bell"></i>
</div> 
 </div> 
        </MenuButton>
        <MenuList pl={4}>
          {!notification.length && "No Notification"}
           {/* If notification there>>  */}
          {notification.map((notifi) =>(
            <MenuItem key={notifi._id} onClick={()=>{
              setSelectedChat(notifi.chat)
              // and remove tht particular notification from notification array 
              setNotification(notification.filter((n)=> n!==notifi))
            }}>
              {/* if it a group chat then show name of group else the name of person  */}
            {notifi.chat.isGroupChat? `New Message in ${notifi.chat.chatName}`:`New Message from ${getSender(user, notifi.chat.users)}`}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <Menu >
        <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
          <Avatar  size="sm" cursor="pointer" name={user.name} src={user.pic}/>
        </MenuButton>
        <MenuList>
          <ProfileModal user={user}>
          <MenuItem>My Profile</MenuItem>
          </ProfileModal>
          <MenuDivider/>
          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </MenuList>
      </Menu>
    </div>
  </Box>

  {/* Drawer component for search user>>>> */}
  <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
   <DrawerOverlay/>
   <DrawerContent>
    <DrawerHeader borderbottomwidth="1px">Search Users</DrawerHeader>
    <DrawerBody>
    <Box display="flex" pb={2}>
      <Input placeholder="Search by name or email" mr={2} value={search} onChange={(e)=>setSearch(e.target.value)}/>
      <Button onClick={handleSearch} >Go</Button>
    </Box>

    {/* Here we show all search results >>>>>>>>> */}
    {loading?(
      // if its loading
      <ChatLoading/>
    ):(
      // Render all search results>>
      searchResult?.map(user=>(
       <UserListItem
        key={user._id}
        user={user}
        handleFunction={()=>accessChat(user._id)}
        />
      ))
    )}
    {/* Loading animation >>>>>>> */}
    {loadingChat && <Spinner ml="auto" display="flex"/>}
   </DrawerBody>
   </DrawerContent>
  </Drawer>
 </>
  );
}

export default SideDrawer
