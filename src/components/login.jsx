import { Link, useNavigate } from "react-router-dom"
import React from 'react'
import { UserAuth } from '../context/authContext'
import { auth, db } from "../firebase"
import { GoogleAuthProvider, signInWithPopup , FacebookAuthProvider } from "firebase/auth"
import { doc, getDoc, setDoc } from "firebase/firestore"

const Login = () => {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const { signIn } = UserAuth()
  const navigate = useNavigate()

  const login = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await signIn(email, password );
      navigate('/home')
    } catch(e) {
      setError(true)
    }
  }
  
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      const docId = user.uid;

      const userName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
  
      const userChatsDocRef = doc(db, "userChats", docId);
      const userChatsDocSnapshot = await getDoc(userChatsDocRef);
      if (!userChatsDocSnapshot.exists()) {
        await setDoc(userChatsDocRef, {});
      }
  
      await setDoc(doc(db, "users", docId), {
        uid: docId,
        userName,
        email,
        photoURL,
      });

      navigate("/home");
    } catch (error) {
      setError(true);
    }
  };

  const handleFacebookSignIn = async (e) => {
    e.preventDefault();
    try {
      const provider = new FacebookAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      
      const docId = user.uid;

      const userName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
  
      const userChatsDocRef = doc(db, "userChats", docId);
      const userChatsDocSnapshot = await getDoc(userChatsDocRef);
      if (!userChatsDocSnapshot.exists()) {

        await setDoc(userChatsDocRef, {});
      }
  
      await setDoc(doc(db, "users", docId), {
        uid: docId,
        userName,
        email,
        photoURL,
      });
  
      navigate("/home");
    } catch (error) {
      setError(true);
    }
  };


  return (
    <div className="flex h-screen">
      <div className=" text-slate-200 px-16 py-40 w-[60%] hidden bg-[conic-gradient(at_left,_var(--tw-gradient-stops))] from-yellow-500 via-purple-500 to-blue-500 md:flex md:flex-col">
        <h1 className=" text-4xl font-bold mb-4">Welcome to ChatTrick</h1>
        <p>Seamless Conversations, Unbounded Connections. Experience the power of real-time communication with our innovative ChatTrick designed to bring people closer, anytime, anywhere.</p>
      </div>

      <div className="w-full flex flex-col items-center justify-center md:w-[40%]">
        <div className=" px-8 rounded max-w-sm w-full">
          <h1 className=" text-xl font-bold animate-bounce md:hidden">ChatTrick</h1>
          <h2 className="inline-block text-transparent bg-clip-text text-4xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 text-gray-800 mb-6">User Login</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Email</label>
              <input
                onChange={(e) => (setEmail(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                type="text"
                id="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
              <input
                onChange={(e) => (setPassword(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
                type="password"
                id="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between mb-5">
              <button
                className={"bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 "}
                type="submit"
                onClick={login}
              >
                Login
              </button>
              <p className="flex flex-col text-center text-sm text-gray-500">
                Not a member?
                <Link to='/signup'>
                  <a href="" className="font-semibold leading-6 text-blue-500 hover:text-blue-700"> Create your account now</a>
                </Link>        
              </p>
            </div>
            </form>
            
            <div className="flex items-center justify-center my-7 text-gray-700 text-sm font-bold ">
              <p> or Log in with </p>
            </div>
            <div className="flex items-center justify-evenly">
              <button
                onClick={handleGoogleSignIn}
                className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 "
              >
                Google
              </button>
              <button
                onClick={handleFacebookSignIn}
                className="bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 "
              >
                Facebook
              </button>
            </div>
            { error && <span className=' absolute top-2 right-2 p-2 rounded-xl bg-red-500 text-white font-semibold'> Something went wrong !</span>}
        </div>
      </div>     
    </div>
  )
}

export default Login