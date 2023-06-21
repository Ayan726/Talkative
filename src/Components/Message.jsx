import React, { useContext, useEffect, useRef } from 'react'
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';

const Message = ({message}) => {
  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({behaviour: "smooth"})
  }, [message]);

  return (
    <div ref={ref} className={`flex ${message.senderId === currentUser.uid ? 'flex-row-reverse' : ''} gap-[20px]`}>
      <div className='flex flex-col items-center text-gray-500 text-sm'>
        <img className='bg-[#ddddf7] w-7 h-7 rounded-[50%] bg-cover' src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" />

        <span>{message.date.toDate().toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}</span>
      </div>

      <div className={`max-w-[80%] flex flex-col gap-[10px] ${message.senderId === currentUser.uid ? 'items-end' : 'items-start'}`}>
      {
        message.text !== "" &&
        <p className={`bg-[#8da4f1] text-white px-4 py-[4px] max-w-max ${message.senderId === currentUser.uid ? 'rounded-b-lg rounded-tl-lg' : 'rounded-b-lg rounded-tr-lg'} max-w-[300px] break-words`}>{message.text}</p>
      }
        {
          message.img &&
        <img className='h-32' src={message.img} alt="" />

        }
      </div>
    </div>
  )
}

export default Message
