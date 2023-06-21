import React, { useContext } from 'react'
import Navbar from './Navbar'
import Search from './Search'
import Chats from './Chats'
import AllUsers from './AllUsers'
import { ChatContext } from '../Context/ChatContext'

const Sidebar = () => {
  const {zero} = useContext(ChatContext);
  return (
    <div className={`absolute top-0 z-[100] h-full sm:static sm:flex-[1] bg-[#3e3c61] flex flex-col ${zero ? 'left-0' : '-left-96'} transition-all`}>
      <Navbar/>
      <Search />
      <AllUsers/>
      <Chats/>
    </div>
  )
}

export default Sidebar
