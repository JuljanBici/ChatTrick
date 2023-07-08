import React from "react"
import { collection, query, where, getDocs, getDoc, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from '../firebase'
import { UserAuth } from '../context/authContext'

const SideSearch = () => {

  const [userName, setUserName] = React.useState("")
  const [otherUser, setOtherUser] = React.useState(null)
  const [error , setError] = React.useState(false)

  const { user } = UserAuth()

  const handleSearch = async () => {
    setOtherUser(null);
    setUserName("")
    const q = query(
      collection(db, "users"),
      where("userName", "==", userName)
    );

    try {
      const querySnapshot = await getDocs(q);
      let foundUser = false;
      querySnapshot.forEach((doc) => {
        setOtherUser(doc.data());
        foundUser = true;
      });

      if (!foundUser) {
        throw new Error("User not found")
      }
    } catch (error) {
      setError(true)
          setTimeout(() => {
      setError(false);
    }, 3000);
    }
    console.log(error)
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      e.preventDefault()
      handleSearch();
    }
  }

  const handleSelect = async () => {
    const combinedId =
      user.uid > otherUser.uid
        ? user.uid + otherUser.uid
        : otherUser.uid + user.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: otherUser.uid,
            userName: otherUser.userName,
            photoURL: otherUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", otherUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            userName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error)
      console.log(otherUser.uid)
    }
    
    setOtherUser(null);
    setUserName("")
  };

  return (
    <div className=" m-2 pb-4">
      <form >   
          <label htmlFor="default-search" className="mb-2 text-sm font-medium sr-only text-white">Search</label>
          <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg aria-hidden="true" className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input value={userName} onKeyDown={handleKey} onChange={e => setUserName(e.target.value)} type="text" className="block bg-transparent w-full p-4 pl-10 text-sm rounded-lg placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="Search a user..." required />
          </div>
      </form>
      {error && <p className="font-bold pt-3 text-red-500"> User not found </p>}
      {otherUser && (
        <div onClick={handleSelect} key={otherUser.uid} className="flex items-center py-4 border-b-[1px] border-gray-700 hover:cursor-pointer hover:text-slate-400 transition-[.2s]">
          <img className="h-9 w-9 rounded-full" src={otherUser.photoURL} alt={otherUser.userName} />
          <p className="pl-2 text-lg">{otherUser.userName}</p>
        </div>
)}
  </div>
  )
}

export default SideSearch