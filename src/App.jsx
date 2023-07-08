import Login from "./components/login"
import Signup from "./components/signup";
import Home from "./home";
import Error from "./components/error"
import {Routes, Route } from 'react-router-dom';
import { AuthContextProvider } from './context/authContext'
import ProtectedRoute from "./components/protectedRoute";
import { ChatContextProvider } from "./context/chatContext";

const App = () => {
  return (
    <AuthContextProvider>
      <ChatContextProvider>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="*" element={<Error/>} />
        </Routes>
      </ChatContextProvider>
    </AuthContextProvider>

  )
}

export default App
