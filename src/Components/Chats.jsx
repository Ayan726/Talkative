import { doc, onSnapshot } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../firebase';
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';





const Chats = () => {
  const [chats, setChats] = useState([]);
  const {currentUser} = useContext(AuthContext);
  const { dispatch, active, setActive, select } = useContext(ChatContext);


  

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
      setChats(doc.data());
    });
    
    return () => unsub();
  }
  currentUser.uid && getChats();
}, [currentUser.uid, select]);


  const handleSelect = (u) => {
    setActive(u.uid);
    dispatch({type:"CHANGE_USER", payload: u });
  }

  return (
    <>
    <h2 className='px-3 h-10 border-b border-b-gray-500 text-white font-semibold flex items-center w-full bg-[#2f2d52]'>Your Chats</h2>
    <div className='flex flex-col overflow-y-scroll scrollbar-none'>
    {
      
      Object.entries(chats)?.sort((a,b) => b[1].date - a[1].date).map(chat => {
        return (
          chat[1].userInfo &&
          <div onClick={() => handleSelect(chat[1].userInfo)} key={chat[0]} className= {`flex items-center justify-start gap-2 text-white capitalize py-2 px-3 cursor-pointer hover:bg-[#343358] w-full ${active === chat[1].userInfo.uid ? 'bg-[#343358]' : ''}`}>
        <img className='w-10 h-10 bg-contain rounded-[50%]' src={chat[1].userInfo.photoURL} alt="pic" />
        <div className='flex flex-col'>
          <span className='font-semibold capitalize'>{chat[1].userInfo.displayName}</span>
          <p className='text-sm text-gray-300 max-w-[160px] break-words'>{chat[1].lastMessage?.text}</p>
        </div>
      </div>
      
        )
      })
    }
    
      
    </div>
    </>
  )
}

export default Chats
