import React, { useContext, useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import { AuthContext } from '../Context/AuthContext';
import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ChatContext } from '../Context/ChatContext';



const AllUsers = () => {

    const [users, setUsers] = useState(null);
    const [chatUser, setChatUser] = useState(null);
    const { currentUser } = useContext(AuthContext);
    const { setActive, dispatch, select, setSelect } = useContext(ChatContext);

    useEffect(() => {
        
            const getUsers = async () => {
              const querySnapshot = await getDocs(collection(db, "users"));
              const arr = querySnapshot.docs.filter(doc => doc.data().uid !== currentUser.uid);
              const userArray = arr.map(doc => doc.data());
              setUsers(userArray);
            }

          currentUser.uid && getUsers();
    }, [currentUser.uid])


   
    useEffect(() => {
        const getChat = async () => {
          if (chatUser == null) return;
      
          const combinedID =
            currentUser.uid > chatUser.uid
              ? currentUser.uid + chatUser.uid
              : chatUser.uid + currentUser.uid;
      
          try {
            setActive(chatUser.uid);
      
            const chatDoc = doc(db, "chats", combinedID);
            const chatSnapshot = await getDoc(chatDoc);
      
            if (!chatSnapshot.exists()) {
              await setDoc(chatDoc, { messages: [] });
            }
      
            const userChatsDocCurrentUser = doc(db, "userChats", currentUser.uid);
            const userChatsSnapshotCurrentUser = await getDoc(userChatsDocCurrentUser);
            const userChatsDataCurrentUser = userChatsSnapshotCurrentUser.data();
      
            if (!(combinedID in userChatsDataCurrentUser)) {
              const currentUserData = {
                uid: chatUser.uid,
                displayName: chatUser.displayName,
                photoURL: chatUser.photoURL,
                date: serverTimestamp(),
              };
      
              await updateDoc(userChatsDocCurrentUser, {
                [combinedID+".userInfo"]: currentUserData,
              });
            }
      
            const userChatsDocChatUser = doc(db, "userChats", chatUser.uid);
            const userChatsSnapshotChatUser = await getDoc(userChatsDocChatUser);
            const userChatsDataChatUser = userChatsSnapshotChatUser.data();
      
            if (!(combinedID in userChatsDataChatUser)) {
              const chatUserData = {
                uid: currentUser.uid,
                displayName: currentUser.displayName,
                photoURL: currentUser.photoURL,
                date: serverTimestamp(),
              };
      
              await updateDoc(userChatsDocChatUser, {
                [combinedID+".userInfo"]: chatUserData,
              });
            }
      
            dispatch({ type: "CHANGE_USER", payload: chatUser });
            setSelect(select => !select);
          } catch (err) {
            console.error("Error: ", err);
          }
        };
      
        if (currentUser.uid && chatUser) {
          getChat();
        }
      }, [chatUser, currentUser.uid]);
      

    
    const handleSelect = (u) => {
        setChatUser(u);
      }

      // console.log("chatuser:", chatUser);

    return (
        <Popup trigger=
            {<button className='px-3 text-white h-10 font-semibold flex justify-start gap-2 items-center w-full bg-[#2f2d52] border-b border-b-gray-500'> All Users 
            <svg 
            className='h-5 w-auto fill-white -rotate-90'
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z"/></svg>
            </button>}
            position="bottom left">
            {
                close => (
                    <div className='modal w-[12.5rem] sm:w-[13.5rem] md:w-[15rem] lg:w-[18.5rem] text-center bg-gray-800 backdrop-blur-sm bg-opacity-25 text-white relative h-[15rem] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500 rounded-md'>
                        <div className='content absolute top-8 flex flex-col w-full'>
                        {
                            users && 
                            users.map(data => {
                                return (
                                    <div onClick={() => handleSelect(data)} key={data.uid} className='h-14 w-full flex justify-start items-center px-3 gap-3 font-semibold text-white cursor-pointer hover:bg-gray-400 hover:bg-opacity-25'>
                                <img className='h-6 w-6 rounded-[50%]' src={data.photoURL} alt="pic" />
                                <span>{data.displayName}</span>
                            </div>
                                )
                            })
                         

                        }
                        </div>
                        <div>
                            <button className='absolute right-3 top-2 outline-none border-none bg-transparent' onClick=
                                {() => close()}>
                                <svg 
                                className='h-5 w-5 fill-white'
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"/></svg>
                            </button>
                        </div>
                    </div>
                )
            }
        </Popup>
    )
}

export default AllUsers
