import React from 'react'
import { useAuth } from '../StoreValues/useAuth.Store'
import { Link } from 'react-router-dom'
import { MessageSquare, Settings, User, LogOut } from 'lucide-react'

const Navbar = () => {
  const { logout, authuser } = useAuth();
  return (
    <header className="bg-base-100 shadow-md border-b border-base-300 fixed w-full z-50 backdrop-blur-lg bg-base-100/80">
      <div className='container mx-auto flex justify-between items-center px-4 py-4 h-16'>
        <div className='flex items-center gap-8'>
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">Chatty</h1>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={"/settings"}
            className={`
              btn btn-sm gap-2 transition-colors
              
              `}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {authuser && (
            <>
              <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button className="flex gap-2 items-center" onClick={logout}>
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar