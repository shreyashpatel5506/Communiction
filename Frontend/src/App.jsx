import React from 'react'
import Navbar from './components/Navbar.jsx'; 
import { Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage.jsx';
import Loginpage from './pages/Loginpage.jsx';
import Signuppage from './pages/Signuppage.jsx';
import Profilepage from './pages/Profilepage.jsx';
import Settingpage from './pages/Settingpage.jsx';

const App = () => {
  return (
    <div>
    <Navbar />

    <Routes>
          <Route path='/' element={<Homepage/>} />
          <Route path='/login' element={<Loginpage/>} />
          <Route path='/signup' element={<Signuppage/>} />
          <Route path='/profile' element={<Profilepage/>}/>
          <Route path='/settings' element={<Settingpage />} />
       </Routes>
       </div>
  )
}

export default App