import React from 'react'
import addAvatar from '../img/addAvatar.png'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

const Register = () => {
  const [err, setErr] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      setLoader(true);
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const storageRef = ref(storage, displayName + uuid());

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            setLoader(false);
            navigate("/");
          } catch (err) {
            setLoader(false);
            setErr(true);
          }
        });
      });
    } catch (err) {
      setLoader(false);
      setErr(true);
    }
  };



  return (
    <div className='formContainer bg-[#a7bcff] w-full h-screen flex justify-center items-center absolute  top-0'>
      <div className='formWrapper flex flex-col items-center gap-2 bg-white px-12 py-4 rounded-lg'>
        <span className='logo text-[#5d5b8d] font-bold text-2xl'>Talkative</span>
        <span className='title text-[#5d5b8d] text-md'>Register</span>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input type="text" className='p-3 border-0 border-b-[1.7px] border-b-[#5d5b8d] w-[250px] placeholder:text-[rgb(175,175,175)] focus:outline-0' placeholder='Display Name'  />

            <input type="email" className='p-3 border-0 border-b-[1.7px] border-b-[#5d5b8d] w-[250px] placeholder:text-[rgb(175,175,175)] focus:outline-0' placeholder='Email' />

            <input type="password" className='p-3 border-0 border-b-[1.7px] border-b-[#5d5b8d] w-[250px] placeholder:text-[rgb(175,175,175)] focus:outline-0' placeholder='Password' />

            <input type="file" id='file' className='p-3 border-0 border-b-[1.7px] border-b-[#5d5b8d] w-[250px] placeholder:text-[rgb(175,175,175)] focus:outline-0 hidden'/>

            <label className='flex items-center justify-start gap-2 cursor-pointer' htmlFor="file">
                <img className='w-8 h-auto' src={addAvatar} alt="add avatar" />
                <span className='text-[rgb(175,175,175)]'>add an avatar</span>
            </label>

            <button type='submit' className='bg-[#7b96ec] py-2 w-full rounded text-white font-bold cursor-pointer border-0 mb-2 relative'>
            <span>Sign Up</span>
            {
              loader &&
            <div className="h-5 w-5 border-white border-[0.3rem]  border-b-[#7b96ec] rounded-full animate-spin inline-block absolute top-3 right-12">

            </div>

            } 

</button>


            {err && <span className='text-yellow-600 text-sm text-center'>&#9888; Something Went Wrong</span>}
        </form>
        <p className='text-[#5d5b8d] text-sm'>Do You Have An Account? <Link className='underline' to="/login">Login</Link></p>
      </div>
    </div>
  )
}

export default Register
