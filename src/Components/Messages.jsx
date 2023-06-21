import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { ChatContext } from '../Context/ChatContext'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
const Messages = () => {
  const [messages, setMessages] = useState([])
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => unsub();
  }, [data.chatId])
  return (
    <div className='bg-[#ddddf7] p-3 flex flex-col justify-start gap-5 overflow-y-auto scrollbar-none h-full'>

      {
        messages.map(m => {
          return <Message message={m} key={m.id} />
        })
      }
      
    </div>
  )
}

export default Messages
