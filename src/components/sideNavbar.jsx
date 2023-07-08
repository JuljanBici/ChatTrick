import off from '../images/off.png'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/authContext'

const SideNavbar = () => {

  const navigate = useNavigate()

  const { logout , user } = UserAuth()

  const handleLogOut = async () => {
    try {
      await logout()
      navigate('/')
    } catch (e) {
      console.log(e.message)
    }
  }

  return (
    <div className=" flex absolute z-50 w-[100%] justify-between items-center px-2 py-5 ">
      <h2 className=" text-transparent bg-clip-text text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-gray-800 lg:text-4xl md:text-xl">ChatTrick</h2>
      <div className=' flex gap-2'>
        <div className=" flex items-center hover:cursor-pointer hover:text-slate-400 transition-[.2s]">
          <img className=" h-6 w-6 rounded-full lg:h-8 lg:w-8" src={user.photoURL} />
          <p className=" pl-2 text-xl font-semibold">{user.displayName}</p>
        </div>
        <button onClick={handleLogOut}>
          <img className=' h-8 p-1 invert hover:invert-0 transition-[.3s]' src={off} />
        </button>
      </div>
    </div>
  )
}

export default SideNavbar
