import { useState } from 'react'
import threeDots from '../images/threeDots.png'
import back from '../images/return.png'
import { UseChats } from '../context/chatContext'
import { UserAuth } from '../context/authContext'
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../firebase'

const ChatNav = ( {toggleSidebar} ) => {

  const { user } = UserAuth()

  const [isToggled, setIsToggled] = useState(false)

  function toogleNav() {
    setIsToggled(!isToggled)
    setTimeout(() => {
      setIsToggled((prevState) => !prevState)
    }, 5000)
  }

  const { data } = UseChats()

  const deleteDocument = async () => {
    try {
      const documentRef = doc(db, "chats", `${data.chatId}`)
      console.log(data.user.uid)

      await updateDoc(documentRef, {
        messages: []
      })

      await updateDoc(doc(db, "userChats", user.uid), {
        [data.chatId + ".lastMessage"]: {
        },
 
      })
  
      await updateDoc(doc(db, "userChats", data.user.uid), {
        [data.chatId + ".lastMessage"]: {
        },
      })
    } catch (error) {
      console.error("Error deleting document:", error);
    }
    toogleNav()
  }

  return (
    <div className="w-full py-4 px-4 ">
      <div className=" text-lg font-semibold flex justify-between text-center ">
        <div className=" flex items-center ">
          <img onClick={toggleSidebar} className=' invert h-5 my-1 mr-5 hover:p-[0.1rem] transition-[.5s] hover:cursor-pointer md:hidden' src={back} />
          <div className=' flex hover:cursor-pointer hover:text-slate-400 transition-[.2s]'>
            <img className=" h-8 w-8 rounded-full" src={data.user?.photoURL} />
            <p className=" pl-2 text-lg font-semibold">{data.user?.userName}</p>
          </div>
        </div>
        <div className=' flex gap-4'>
          <img onClick={toogleNav} src={threeDots} className=' invert h-5 my-1 hover:p-[0.1rem] transition-[.5s] hover:cursor-pointer' />
          <div id={isToggled ? "toggled" : ""} className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-800">
            <ul className=" text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
              <li>
                <a onClick={deleteDocument} className="block px-4 py-3 font-bold hover:cursor-pointer hover:text-red-500 transition-[.2s] ">Delete chat</a>
              </li>
            </ul>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ChatNav