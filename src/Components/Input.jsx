import React, { useContext, useState } from 'react'
import img from '../img/img.png'
import attach from '../img/attach.png'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'


const Input = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const handleSend = async () => {
    if(text == "" && image == null)return;
    if (image) {
      const storageRef = ref(storage, uuid());
  
      await uploadBytesResumable(storageRef, image).then(async (snapshot) => {
        const downloadURL = await getDownloadURL(snapshot.ref);
        await updateDoc(doc(db, "chats", data.chatId), {
          messages: arrayUnion({
            id: uuid(),
            text,
            senderId: currentUser.uid,
            date: Timestamp.now(),
            img: downloadURL,
          }),
        });
      });
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId+".lastMessage"]:{
        text
      },
      [data.chatId+".date"]: serverTimestamp()
    })

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId+".lastMessage"]:{
        text
      },
      [data.chatId+".date"]: serverTimestamp()
    })

    setText("");
    setImage(null);


  };
  

  const handleKey = (e) => {
    e.code === 'Enter' && handleSend();
  }

  return (
    <div className='h-[50px] bg-white w-full flex items-center justify-between px-4 absolute bottom-0'>
      <input onKeyDown={handleKey} value={text} onChange={(e) => setText(e.target.value)} className='w-full outline-none border-none h-full placeholder:text-gray-400' type="text" placeholder='Type Something...'/>
      <div className='flex justify-center items-center gap-2'>
        <img className='hidden h-6 w-auto cursor-pointer' src={attach} alt="attach" />
        <input className='hidden' type="file" id="file" onChange={(e) => setImage(e.target.files[0])}/>
        <label htmlFor="file">
          <img className='w-14 lg:w-10 h-6 cursor-pointer' src={img} alt="img" />
        </label>
        <button onClick={handleSend} className='border-none outline-none text-white bg-[#8da4f1] px-2 py-0.5 rounded ml-3 text-sm'>Send</button>
      </div>
    </div>
  )
}

export default Input
