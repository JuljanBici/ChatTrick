import SideNavbar from "./sideNavbar"
import SideSearch from "./sideSearch"
import SideChats from "./sideChats"

const Sidebar = ({ chatOn, updateParentState, toggleSidebar , isOpen }) => {
  return (
    <div className="relative bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white h-full overflow-y-scroll">
      <SideNavbar isOpen={isOpen} />
      <div className=" pt-20">
        <SideSearch />
        <SideChats toggleSidebar={toggleSidebar} chatOn={chatOn} updateParentState={updateParentState} />
      </div>

    </div>
  )
}

export default Sidebar