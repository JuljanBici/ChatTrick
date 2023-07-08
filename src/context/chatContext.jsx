import { createContext, useContext, useReducer } from "react";
import { UserAuth } from '../context/authContext'

const ChatContext = createContext()

export const ChatContextProvider = ({ children }) => {
  const {user} = UserAuth()
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  }

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            action.payload.uid > user.uid 
            ? action.payload.uid + user.uid 
            : user.uid + action.payload.uid
        }
        default:
          return state
    }
  }
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE)

  return(
    <ChatContext.Provider value={{ data:state, dispatch }}>
      {children}
    </ChatContext.Provider>
  )
}

export const UseChats = () => {
  return useContext(ChatContext)
}