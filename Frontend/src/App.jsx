import React, { useEffect } from 'react'
import Navbar from './components/Navbar.jsx'; 
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import Loginpage from './pages/Loginpage.jsx';
import Signuppage from './pages/Signuppage.jsx';
import Profilepage from './pages/Profilepage.jsx';
import Settingpage from './pages/Settingpage.jsx';
import { useAuth } from './StoreValues/useAuth.Store.js';
import {Loader} from "lucide-react"
import { Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const {userAuth,checkAuth,isCheckAuth} = useAuth();
  useEffect(() => {
      checkAuth();
  }, [userAuth])

  if(isCheckAuth && !userAuth){
    return (<div className="flex items-center justify-center h-screen">
        <Loader className="size-10" animate-spin/>
      </div>)
  }
  return (
    <div>
    <Navbar />

    <Routes>
          <Route path='/' element={userAuth ? <Homepage/> : <Navigate to='/login' />} />
          <Route path='/login' element={!userAuth ? <Loginpage/> : <Navigate to='/' />} />
          <Route path='/signup' element={!userAuth ? <Signuppage/> : <Navigate to='/' />} />
          <Route path='/profile' element={userAuth ? <Profilepage/> : <Navigate to='/login' />}/>
          <Route path='/settings' element={<Settingpage />} />
       </Routes>

       <Toaster position="top-right" />
       </div>
  )
}

export default App