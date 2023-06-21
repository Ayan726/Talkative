import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useReducer, useState } from "react";
import { auth } from "../firebase";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({children}) => {

    // {
    //     user:{},
    //     chatID: 
    // }

    const {currentUser} = useContext(AuthContext);
    const [active, setActive] = useState(null);
    const [select, setSelect] = useState(true);
    const [zero, setZero] = useState(false);
    



    const INITIAL_STATE = {
        chatId: "null",
        user:null,
    }

    const chatReducer = (state, action) => {
        switch(action.type){
            case "CHANGE_USER":
                return{
                    user: action.payload,
                    chatId: currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid,
                };
            default:
                return state;
            
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return(

    <ChatContext.Provider value = {{ data: state, dispatch, active, setActive, select, setSelect, zero, setZero}}>
        {children}
    </ChatContext.Provider>
    )
};