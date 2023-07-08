import Sidebar from "./components/sidebar"
import Chat from './components/chat'
import { useState } from "react"

const Home = () => {

  const [isOpen, setIsOpen] = useState(false)

  function ToggleSidebar() {
    setIsOpen(!isOpen)
    console.log(isOpen)
  }


  const [opened, setOpened] = useState(false)

  const chatOn = () => {
    if(!opened) {
      setOpened(true)
    }
  }

  const updateParentState = (newValue) => {
    setOpened(newValue);
  };

  return (
    <div className="flex h-screen">
      <div className={`${isOpen ? "w-[0%]" : "w-[100%]"} z-50 bottom-0 top-0 fixed md:w-[35%]` }>
       <Sidebar toggleSidebar={ToggleSidebar} isOpen={isOpen} chatOn={chatOn} updateParentState={updateParentState}/>
      </div>
      <div className="w-[100%] fixed ml-[0%] z-0 md:ml-[35%] md:w-[65%]">
        <Chat toggleSidebar={ToggleSidebar} opened={opened}/>
      </div>

    </div>
  )
}

export default Home