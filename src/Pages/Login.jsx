import React from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [err, setErr] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target[0].value);
    const email = e.target[0].value;
    const password = e.target[1].value;

    try{
      setLoader(true);
      await signInWithEmailAndPassword(auth, email, password);
      setLoader(false);
      navigate("/");

    } catch(err) {
      // console.log(err);
      setLoader(false);
      setErr(true);
    }

  }


  return (
    <div className='formContainer bg-[#a7bcff] w-full h-screen flex justify-center items-center absolute top-0'>
      <div className='formWrapper flex flex-col items-center gap-2 bg-white px-12 py-4 rounded-lg'>
        <span className='logo text-[#5d5b8d] font-bold text-2xl'>Talkative</span>
        <span className='title text-[#5d5b8d] text-md'>LogIn</span>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            

            <input type="email" className='p-3 border-0 border-b-[1.7px] border-b-[#5d5b8d] w-[250px] placeholder:text-[rgb(175,175,175)] focus:outline-0' placeholder='Email' />

            <input type="password" className='p-3 border-0 border-b-[1.7px] border-b-[#5d5b8d] w-[250px] placeholder:text-[rgb(175,175,175)] focus:outline-0' placeholder='Password' />

            <button type='submit' className='bg-[#7b96ec] py-2 w-full rounded text-white font-bold cursor-pointer border-0 mb-2 relative'>
            <span>Sign In</span>
            {
              loader &&
            <div className="h-5 w-5 border-white border-[0.3rem]  border-b-[#7b96ec] rounded-full animate-spin inline-block absolute top-3 right-12">

            </div>

            } 
            </button>

            {err && <span className='text-yellow-600 text-sm text-center'>&#9888; Something Went Wrong</span>}
        </form>
        <p className='text-[#5d5b8d] text-sm'>Do You Don't Have An Account? <Link className='underline' to="/register">Register</Link></p>
      </div>
    </div>
  )
}

export default Login
