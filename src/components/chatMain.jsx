import { useEffect, useState, useRef } from 'react'
import addImg from '../images/addImg.png'
import { UseChats } from '../context/chatContext'
import { UserAuth } from '../context/authContext'
import { Timestamp, arrayUnion, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { v4 as uuid} from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const ChatMain = () => {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [img, setImg] = useState(null)
  const { data } = UseChats()
  const { user } = UserAuth()

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc)=> {
      doc.exists() && setMessages(doc.data().messages)
    })
    return () => {
      unSub()
    }
  },[data.chatId])

  const handleSend = async (e) => {
    e.preventDefault()
    if (img || text) {
    if(img){
      try{
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (error) => {
          console.log("Error occurred during image upload:", error);
        },
        async () => {
          console.log("Image uploaded successfully");
          setTimeout(() => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text,
                  senderId: user.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            });
          }, 1000);
        }
      );
    } catch (error) {
      console.log("brawo")
    }

    } else {
      await updateDoc(doc(db, "chats", data.chatId),{
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: user.uid,
          date: Timestamp.now()
        })
      })
    }

    await updateDoc(doc(db, "userChats", user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(), 
    })

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(), 
    })

    setText("")
    setImg(null)
  }}

  const messageRef = useRef();

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <div className="relative w-full flex h-full flex-col overflow-hidden">
    <div className=" flex flex-col overflow-y-scroll rounded-2xl py-2 mb-16 px-4">
      {messages.map((message) => (
        <>
          <div id={message.id} ref={messageRef} className={`flex ${message.senderId === user.uid ? "flex-row-reverse" : "flex-row"}`}>
          <div className={`flex items-center ${message.senderId === user.uid ? "flex-row-reverse" : "flex-row"}`}>
            <div className=' flex flex-col items-center justify-center'>
              <img className=" h-9 w-9 rounded-full mx-2 my-2" src={
                message.senderId === user.uid
                  ? user.photoURL
                  : data.user.photoURL
                } />
            </div>
              <div>
                {message.text && <p className={`flex overflow-hidden max-w-[15rem] md:max-w-md gap-5 rounded-2xl ${message.senderId === user.uid ? "rounded-br-none bg-gradient-to-r from-sky-600 to-blue-600" : "rounded-bl-none bg-slate-800 border-[1px] border-gray-700"} my-2 py-2 px-4`}>
                  <p className="whitespace-normal break-words overflow-x-auto">{message.text}</p>
                  <p className='flex text-[.65rem] self-end text-gray-300'>{message.date.toDate().toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </p>}
                {message.img && (
                <p className={`flex ${message.senderId === user.uid ? "justify-end" : "justify-start"}`}>
                  <img className=' h-30 w-40 rounded-xl' src={message.img} />
                </p>
                )}
              </div>
          </div>
          </div>
        </>
      ))}
    </div>
    <form className="absolute w-full bottom-1 mt-3 pb-20">   
    <label htmlFor="default-search" className=" text-sm font-medium sr-only text-white">Search</label>
      <div className="relative">
        <input value={text} onChange={e=> setText(e.target.value)} type="text" className="block w-full p-4 pr-36 text-sm border-[1.5px] rounded-lg  bg-gray-700 border-blue-500 placeholder-gray-400 text-white focus:ring-0 focus:outline-none " placeholder="Write something..." required />
        <input onChange={e=> setImg(e.target.files[0])} type="file" className=' hidden text-white ' id="file"/>
        <label  htmlFor="file" className='absolute right-[6rem] bottom-[0.8rem] hover:cursor-pointer'>
          <img className=' invert h-8' src={addImg} alt="" />
        </label>
        <button onClick={handleSend} type="submit" className="text-white absolute right-2.5 bottom-2.5 font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 active:bg-blue-800 hover:bg-blue-700 transition-[.2s]" >Send</button>
      </div>
    </form>
    </div>
  )
}

export default ChatMain