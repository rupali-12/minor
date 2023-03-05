import React, { useState } from 'react'
import { Box, Modal, ModalOverlay,ModalHeader, ModalContent,ModalFooter, Button, ModalBody, useDisclosure, useToast, FormControl, Input } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import UserBadgeItem from '../userAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] =useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult]= useState([]);
  const [loading, setLoading]= useState(false);
  const toast= useToast();

// Now after we create group chat we are gonna append it to the list of the chats that we already have 
// Take contextApi state>>>>>>
   const {user, chats, setChats}= ChatState();

   const handleSearch=async(query)=>{
      setSearch(query);
      if(!query){
        return
      }
      try{
        setLoading(true);
        const config={
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const {data} = await axios.get(`/api/user?search=${search}`, config);
        // console.log(data);
        setLoading(false)
        setSearchResult(data);
      }catch(error){
       toast({
      title: "Error Occured",
      description: "Failed to Load the Search Results",
      status: "error",
      duration:5000,
      isClosable:true,
      position: "bottom-left"
     })
     return;
      }
   }
   const handleGroup=(userToAdd)=>{
     if(selectedUsers.includes(userToAdd)){
       toast({
         title: "User Already added",
         status: "warning",
         duration: 5000,
         isClosable: true,
         position: "top",
        });
        return;
      }
      setSelectedUsers([...selectedUsers, userToAdd]);
    };

    // For submit the group creation form >>>>>>
    const handleSubmit=async()=>{
      if(!groupChatName || !selectedUsers){
          toast({
         title: "Please Fill all Fields",
         status: "warning",
         duration: 5000,
         isClosable: true,
         position: "top",
        });
        return; 
      }
       
      try{
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
        const {data} = await axios.post(`api/chat/group`,{
          name: groupChatName, 
          users: JSON.stringify(selectedUsers.map((u)=>u._id)),
        }, config);
        setChats([data, ...chats]);
        onClose();
        toast({
         title: "New Group Chat Created",
         status: "success",
         duration: 5000,
         isClosable: true,
         position: "top",
        });
      }catch(error){
        toast({
         title: "Failed to Create the Chat",
         description: error.response.data,
         status: "error",
         duration: 5000,
         isClosable: true,
         position: "top",
        });
      }
    }

   const handleDelete=(delUser)=>{
     setSelectedUsers(
      selectedUsers.filter((sel)=>sel._id!==delUser._id)
     );
   };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="center" fontSize="35px" fontFamily="Work sans" fontWeight="bold" >Create Group Chat</ModalHeader>
          <ModalBody display="flex" flexDir="column" alignItems="center" >
           <FormControl>
            <Input  placeholder='Chat Name' mb={3} onChange={(e)=>setGroupChatName(e.target.value)}/>
           </FormControl>
           <FormControl>
            <Input  placeholder='Search User Name' mb={1} onChange={(e)=>handleSearch(e.target.value)}/>
           </FormControl>

          <Box w="100%" display="flex" flexWrap="wrap">
             {/* Selected Users  */}
           {selectedUsers.map(u=>(
             <UserBadgeItem key={user._id} user={u}
             handleFunction={()=>handleDelete(u)}
             />
           ))}
          </Box>

           {/* Render search user>>>>>>>>>>> */}
           {loading?<div>loading</div>:(
            // at one time i m going to show 4 search results 
            searchResult?.slice(0,4).map((user)=>
              <UserListItem key={user._id} user={user} handleFunction={()=>handleGroup(user)}/>
            )
           )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
