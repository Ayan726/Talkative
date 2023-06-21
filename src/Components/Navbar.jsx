import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { auth } from '../firebase'
import { AuthContext } from '../Context/AuthContext'

const Navbar = () => {
  const {currentUser} = useContext(AuthContext);

  return (
    <div className='flex items-center bg-[#2f2d52] h-16 px-3 justify-between text-white'>
      <span className='hidden lg:inline font-bold'>Talkative</span>
      <div className='flex items-center justify-center gap-2'>
        <img className='bg-[#ddddf7] w-6 h-6 rounded-[50%] bg-cover' src={currentUser.photoURL} alt="user" />
        <span className='mr-2 font-semibold capitalize'>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)} className='bg-[#5d5b8d] px-[5px] rounded py-0.5 text-sm cursor-pointer text-[#ddddf7] ml-6 lg:ml-0'>Logout</button>
      </div>
    </div>
  )
}

export default Navbar
