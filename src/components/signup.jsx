import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/authContext'
import { updateProfile } from 'firebase/auth'
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { db, storage } from "../firebase";
import { doc, setDoc } from 'firebase/firestore'
import React from 'react'
import addImg from '../images/addImg.png' 

const Signup = () => {

  const [userName, setUserName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false);
  const [password, setPassword] = React.useState('')
  const [err, setErr] = React.useState(false)
  const [file, setFile] = React.useState(null)
  const { createUser } = UserAuth()
  const navigate = useNavigate()

  const signup = async (e) => {
    e.preventDefault();
    try {
      const res = await createUser(email, password);
      const date = new Date().getTime();
      const storageRef = ref(storage, `${userName + date}`);
      
      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            await updateProfile(res.user, {
              displayName: userName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              userName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/home");
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });
      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <div className=" text-slate-200 px-16 py-40 w-[60%] hidden bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-yellow-500 via-purple-500 to-blue-500 md:flex md:flex-col">
        <h1 className=" text-4xl font-bold mb-4">Welcome to ChatTrick</h1>
        <p>Seamless Conversations, Unbounded Connections. Experience the power of real-time communication with our innovative ChatTrick designed to bring people closer, anytime, anywhere.</p>
      </div>

      <div className="w-full flex flex-col items-center justify-center md:w-[40%]">
        <div className="bg-white p-8 rounded max-w-sm w-full">
          <h2 className="inline-block text-transparent bg-clip-text text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-gray-800 mb-6">User SignUp</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
              <input
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                type="text"
                id="username"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                type="text"
                id="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className='hidden text-white ' id="file"/>
              <label htmlFor="file" className='flex items-center gap-2 my-6 hover:cursor-pointer'>
                <img className=' h-8' src={addImg} alt="" />
                <span>Add an Profile Picture</span>
              </label>
            <div className="flex items-center justify-between mb-5">
              <button
                disabled={loading}
                onClick={signup}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
                type="submit"
              >
                Sign Up
              </button>
              {loading && "Uploading and compressing the image please wait..."}
              <p className="flex flex-col text-center text-sm text-gray-500">
                Already a member?
                <Link to='/'>
                  <a href="" className="font-semibold leading-6 text-blue-500 hover:text-blue-700"> Log in to your account now</a>
                </Link>        
              </p>
            </div>
            { err && <span className=' absolute top-2 right-2 p-2 rounded-xl bg-red-500 text-white font-semibold'> Something went wrong !</span>}
          </form>
        </div>
      </div>     
    </div>
  )
}

export default Signup