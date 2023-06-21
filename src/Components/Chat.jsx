import React, { useContext } from 'react'
import cam from '../img/Cam.png'
import add from '../img/add.png'
import more from '../img/more.png'
import Messages from './Messages'
import Input from './Input'
import { ChatContext } from '../Context/ChatContext'

const Chat = () => {
  const { data, setZero, zero } = useContext(ChatContext);


  return (

    <div onClick={() => setZero(false)} className='flex-[2] relative h-full'>
    <div onClick={(e) => {
      e.stopPropagation();
      setZero(!zero)}
      } 
      className="hamburger sm:hidden flex flex-col gap-1 absolute left-3 top-6 z-10">
      <div className={`h-[3px] w-5 rounded-full ${data.user ? 'bg-[#ddddf7]' : 'bg-gray-500'}`}></div>
      <div className={`h-[3px] w-5 rounded-full ${data.user ? 'bg-[#ddddf7]' : 'bg-gray-500'}`}></div>
      <div className={`h-[3px] w-5 rounded-full ${data.user ? 'bg-[#ddddf7]' : 'bg-gray-500'}`}></div>
      
    </div>

    {
      data.user ?
      <>
      {/* topbar */}
      <div className='h-[64px] w-full flex bg-[#5d5b8d] items-center justify-between p-4 text-[#ddddf7]'>
      <div className='flex gap-2 justify-start items-center ml-8 sm:ml-0'>
        <img className='w-8 h-8 rounded-[50%]' src={data.user?.photoURL} alt="" />
        <span className='font-semibold capitalize'>{data.user?.displayName}</span>
      </div>

        <div className='flex items-center justify-center gap-2'>
          <img className='h-7 w-auto cursor-pointer' src={cam} alt="camera" />
          <img className='h-7 w-auto cursor-pointer' src={add} alt="add" />
          <img className='h-7 w-auto cursor-pointer' src={more} alt="more" />
        </div>
      </div>

      {/* messages */}
      <div className='w-full flex flex-col' style={{height: 'calc(100% - 113px)'}}>
      <Messages/>
      <Input/>
      </div>
      </>:
      
      <div className='h-full bg-gray-100 w-full flex text-lg sm:text-xl text-gray-400 font-semibold justify-center items-center'>
        Choose An User To Start Conversation!!
      </div>


    }
    
    </div>
  )
}

export default Chat
