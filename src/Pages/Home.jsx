import React from 'react'
import Sidebar from '../Components/Sidebar'
import Chat from '../Components/Chat'

const Home = () => {
  return (
    <div className='bg-[#a7bcff] overflow-y-hidden h-screen w-full flex justify-center items-center absolute top-0'>
    <div className='relative rounded shadow-lg shadow-gray-700 w-full sm:w-[90%] md:w-[75%] lg:w-[65%] h-full sm:h-[80%] flex overflow-hidden'>
      <Sidebar/>
      <Chat/>
    </div>
    </div>
  )
}

export default Home
