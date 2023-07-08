import ChatNav from "./chatNav"
import ChatMain from "./chatMain"
import wassup from '../images/wassup.png'

const Chat = ({ opened , toggleSidebar }) => {
  return (
    <>
    {opened 
    ? <div className=" flex flex-col h-screen w-full items-center text-white py-2 px-4 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <ChatNav toggleSidebar={toggleSidebar} />
        <ChatMain />
      </div> 
    : <div className="h-screen flex flex-col items-center justify-center w-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700">
        <img className=" h-64" src={wassup} />
        <p className=" font-light text-gray-300" >No chat opened yet...</p>
      </div> }
    </>
  )
}

export default Chat