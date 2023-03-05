// Create context >>>>>>>>>>>>
import React, {createContext, useContext, useState, useEffect} from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();
const ChatProvider = ({children}) => {
     // now although we will access inside that componenet only but here we will create inside of context ap so this will be accessible for whole app
    const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const history = useHistory();

 // here we fetch uer infor using useEffect >>
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

 // if user is not login then we redirect it to login page
    if (!userInfo) history.push("/");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return (
    <ChatContext.Provider
      value={{ selectedChat, setSelectedChat, user, setUser, notification, setNotification, chats, setChats}}>
      {children}
    </ChatContext.Provider>
  );
};

// create hooks to make accessible this in other parts of our app >>>>>>>>>>>>>
export const ChatState=()=>{
    return useContext(ChatContext);
}
export default ChatProvider;