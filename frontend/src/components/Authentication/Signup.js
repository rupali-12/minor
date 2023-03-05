import React from 'react'
import { Button } from '@chakra-ui/react';
import { FormControl , FormLabel} from '@chakra-ui/form-control';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/input';
import { VStack } from '@chakra-ui/layout';
import { useToast } from '@chakra-ui/toast';
import axios from 'axios';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';


const Signup = () => {
  const [show, setShow]=useState(false)
  const [name, setName]=useState();
  const [email, setEmail]=useState();
  const [password, setPassword]=useState();
  const [confirmpassword, setConfirmpassword]=useState();
  const [pic, setPic]=useState();
  const [loading, setPicLoading]=useState(false);
  const toast = useToast();
  const history= useHistory();

  const handleClick=()=>setShow(!show);
  // For uploading the picture 
  const postDetails=(pics)=>{
    setPicLoading(true);
    if(pics===undefined){
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position:"bottom",
      });
      return;
    }
    if(pics.type==="image/jpeg"|| pics.type==="image/png"){
      const data= new FormData();
      data.append("file", pics);
      // data.append("upload_preset", "Cackle");
      data.append("cloud_name", "dpcwlx8ui");  // this is cloud name check on cloudinary
      fetch("CLOUDINARY_URL=cloudinary://792229755885115:nQOPNXo0_lCqmgzTFPtcpikP2XA@dpcwlx8ui",{
      // fetch("https://api.cloudinary.com/v1_1/roadsidecoder/image/upload", {
        method: 'post',
        body: data,
      }).then((res)=>res.json())
        .then((data)=>{
          setPic(data.url.toString());
          setPicLoading(false);
        }).catch((err)=>{
          console.log(err);
          setPicLoading(false);
        });
    }
    else{
      toast({
        title: "Please Select an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position:"bottom",
      });
      setPicLoading(false)
      return;
    }
  };

  // for submit data in database >>>>>>>>>>>>>>>>>>>>>>>>>>
  const submitHandler=async()=>{
    if(!name || !email || !password || !confirmpassword){
      toast({
        title: "Please Fill all the required Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position:"bottom",
      });
      // setPicLoading(false);
      return;
    }
    if(password !== confirmpassword){
      toast({
        title: "Password and ConfirmPassword should be Same",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position:"bottom",
      });
      return;
    }
    try{
      const config={
        headers:{
          "Content-type": "application/json",
        },
      };
      const {data}=await axios.post("/api/user", {name, email, password, pic}, config);
      toast({
        title: "Registration is Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position:"bottom",
      });
     localStorage.setItem("userInfo", JSON.stringify(data));
     setPicLoading(false);
    //  history.push('./chats')
    }catch(error){
    toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position:"bottom",
      });
      setPicLoading(false);
    }
  };

  return (
  <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
     <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        // isLoading={picLoading}
        isLoading= {loading}
      >
        Sign Up
      </Button>
    </VStack> 
  );
};

export default Signup
