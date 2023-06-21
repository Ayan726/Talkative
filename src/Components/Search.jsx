import React, { useContext, useState } from 'react'
import { collection, query, where, getDocs, getDoc, setDoc, doc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from '../firebase'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext';

const Search = () => {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { dispatch, setActive } = useContext(ChatContext);
 

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", userName));
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        setUser(null);
        setErr(true);
        return;
      }
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
        setErr(false);
      });

    } catch (err) {
      console.log(err);
      setErr(true);
      setUser(null);
    }
  }

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch();
  }

  const handleSelect = async () => {
    setActive(user.uid);
    // check whether the group(chats in firestore) exists or not , and if not create one
    const combinedID = currentUser.uid > user.uid ? currentUser.uid + user.uid :
      user.uid + currentUser.uid;
    try {

      const res = await getDoc(doc(db, "chats", combinedID))

      if (!res.exists()) {
        // create a chat in chats collection
        await setDoc(doc(db, "chats", combinedID), { messages: [] });

        // create user chats
        // userChats:{
        //   janesId:{
        //     combinedID:{
        //       userInfo:{
        //         dn, img, id
        //       }
        //       lastMessage: "",
        //       date: 
        //     }
        //   }
        // }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedID + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp()

        })

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedID + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp()

        })

      }

      dispatch({type:"CHANGE_USER", payload: user });

    } catch (err) {
      setErr(err);
    }

    setUser(null);
    setUserName("");

  }

  return (
    <div className='border-b border-b-gray-500 flex flex-col'>
      <div className='p-[10px]'>
        <input onKeyDown={handleKey} onChange={e => setUserName(e.target.value)} value={userName} className='bg-transparent border-none outline-none text-white placeholder:text-gray-300' type="text" placeholder='find a user' />
      </div>

      {err && <span className='text-yellow-300 text-sm text-center w-full mb-2 px-2'>&#9888;User Not Found</span>}

      {
        user &&
        <div onClick={handleSelect} className='flex items-center justify-start gap-2 text-white capitalize py-2 px-3 cursor-pointer hover:bg-[#2f2d52] w-full'>
          <img className='w-10 h-10 bg-contain rounded-[50%]' src={user.photoURL} alt="pic" />
          <div className='flex flex-col'>
            <span className='font-semibold'>{user.displayName}</span>
          </div>
        </div>

      }
    </div>
  )
}

export default Search
