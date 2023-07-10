import { doc, onSnapshot, updateDoc, deleteField, deleteDoc } from 'firebase/firestore'
import { UserAuth } from '../context/authContext'
import React, { useEffect } from 'react'
import { db } from '../firebase'
import { UseChats } from '../context/chatContext'
import bin from '../images/bin.png'

const SideChats = ({ chatOn , updateParentState, toggleSidebar }) => {

  const [chats, setChats] = React.useState([])
  const { user } = UserAuth()
  const { dispatch, data } = UseChats()

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
        setChats(doc.data())
    })

    return () => {
      unsub()
    }
  }
  user.uid && getChats()
}, [user.uid])

  const handleSelect = (u) => {
    dispatch({type:'CHANGE_USER', payload: u});
  }

  const deleteChatDocument = async () => {
    try {
      const documentRef = doc(db, "chats", `${data.chatId}`)

      await deleteDoc(documentRef)
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  }

  const deleteChat = async () => {
    console.log(data.chatId)
    try {
      await updateDoc(doc(db, "userChats", user.uid), {
        [data.chatId]: deleteField()
      })
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId]: deleteField()
      })
    } catch (error) {
      console.error("Error deleting document:", error);
    }
    deleteChatDocument()
    updateParentState(false)
  }

  return (
    <div className=" mx-4 ">
      <h1 className=" font-bold text-xl"> Message ·</h1>
      <p className=" text-slate-400 text-xs py-3">RECENT CHAT</p>
      {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
        <div id='users' className=' flex mb-5 items-center justify-between bg-gradient-to-l from-sky-600 to-blue-600 px-3 rounded-xl shadow shadow-blue-900' key={chat[0]}>
          <div onClick={() => {
            handleSelect(chat[1].userInfo);
            chatOn();
            toggleSidebar();
          }}  className="flex w-full items-center py-4  hover:cursor-pointer transition-[.2s]">
            <img className="h-10 w-10 rounded-full" src={chat[1].userInfo.photoURL} />
            <div className="flex flex-col ml-2">
              <p className="text-md font-medium">{chat[1].userInfo.userName}</p>
              <p className="text-xs text-slate-300">  
                {chat[1].lastMessage?.text && chat[1].lastMessage.text.length > 15
                  ? `${chat[1].lastMessage.text.substring(0, 15)}...`
                  : chat[1].lastMessage?.text}
              </p>
            </div>
          </div>
          {data.chatId === chat[0] && (
              <div onClick={() => deleteChat(chat[0])}>
                <img src={bin} className="h-7 invert hover:h-8 active:h-9 transition-[.15s]" />
              </div>
            )}
        </div>
    ))}
  </div>
  )
}

export default SideChats
