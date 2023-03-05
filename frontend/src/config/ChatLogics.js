// Here we create getSender() function>>>>>>>>>>>>>
export const getSender=(loggedUser, users)=>{
    // Inside the users array , its gonna leave the user that is logged in and return the user which is not logged in >>>
  return users[0]._id===loggedUser._id? users[1].name : users[0].name;
}

// Return complete profile of user 
export const getSenderFull=(loggedUser, users)=>{
  return users[0]._id===loggedUser._id? users[1] : users[0];
}


// Logic for same sender>>>>
export const  isSameSender=(messages, m, i, userId)=>{
      return (
        i<messages.length-1 && 
        (messages[i+1].sender._id!==m.sender._id ||
          messages[i+1].sender._id === undefined) &&
          messages[i].sender._id !== userId
      );
};

// Logic for is last message or not >>>>
export const isLastMessage=(messages, i, userId)=>{
  return (
        i===messages.length-1 && 
        messages[messages.length-1].sender._id!==userId  &&
          messages[messages.length-1].sender._id 
      );
}

// Login for isSameSenderMargin>>>>
export const isSameSenderMargin=(messages, m, i, userId)=>{
     if(
      i<messages.length-1 &&
      messages[i+1].sender._id ===m.sender._id &&
      messages[i].sender._id !== userId
     )
     return 33;
     else if(
      (i<messages.length-1 &&
        messages[i+1].sender._id !==m.sender._id &&
        messages[i].sender._id !==userId) ||
        (i===messages.length-1 && messages[i].sender._id !==userId)
     )
     return 0;
     else return"auto";
};

// Logic for same user >>>>
export const isSameUser=(messages, m, i)=>{
   return i>0 && messages[i-1].sender._id === m.sender._id;
}