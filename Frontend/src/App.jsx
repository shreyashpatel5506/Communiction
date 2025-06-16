import React, { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'; 
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import Loginpage from './pages/Loginpage.jsx';
import Signuppage from './pages/Signuppage.jsx';
import Profilepage from './pages/Profilepage.jsx';
import Settingpage from './pages/Settingpage.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import { useAuth } from './StoreValues/useAuth.Store.js';
import {Loader} from "lucide-react"
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const {authuser,checkAuth,isCheckAuth} = useAuth();
  useEffect(() => {
      checkAuth();
  }, [authuser])

  if(isCheckAuth && !authuser){
    return (<div className="flex items-center justify-center h-screen">
        <Loader className="size-10" animate-spin/>
      </div>)
  }
  return (
    <div>
    <Navbar />

    <Routes>
          <Route path='/' element={authuser ? <Homepage/> : <Navigate to='/login' />} />
          <Route path='/login' element={!authuser ? <Loginpage/> : <Navigate to='/' />} />
          <Route path='/signup' element={!authuser ? <Signuppage/> : <Navigate to='/' />} />
          <Route path='/profile' element={authuser ? <Profilepage/> : <Navigate to='/login' />}/>
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/settings' element={<Settingpage />} />
       </Routes>

       <Toaster position="top-right" />
       </div>
  )
}

export default App