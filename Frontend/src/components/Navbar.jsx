import React, { useState, useEffect } from 'react';
import { useAuth } from '../StoreValues/useAuth.Store';
import { Link } from 'react-router-dom';
import { MessageSquare, Settings, User, LogOut, Send } from 'lucide-react';
import { usePeoples } from '../StoreValues/peoples.store';
import avtatar from '../assets/avatar-default-symbolic.svg';

const Navbar = () => {
  const { logout, authuser } = useAuth();
  const {
    fetchAllUsers,
    allusers,
    sendFollowRequest,
    isLoadingAllUsers,
    followers,
    sendingRequestUsers,
    pendingRequestUsers,
  } = usePeoples();

  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchAllUsers(searchQuery);
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
    // eslint-disable-next-line
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSendRequest = async (userId) => {
    await sendFollowRequest(userId);
  };

  const isUserInList = (userId, list) => {
    return list.some(user => user._id === userId);
  };

  const pendingRequestUsersCount = pendingRequestUsers.length;

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

        <div className="flex items-center gap-2 relative">
          {authuser && (
            <>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search users..."
                  className="input input-bordered input-sm w-48 sm:w-64"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />

                {/* Dropdown list */}
                {showDropdown && allusers.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 w-full bg-base-100 border border-base-300 shadow-lg rounded-lg z-50 max-h-60 overflow-auto">
                    {isLoadingAllUsers ? (
                      <div className="p-3 text-center text-sm">Loading...</div>
                    ) : (
                      allusers.map((user) => {
                        const isFollower = isUserInList(user._id, followers);
                        const isRequested = isUserInList(user._id, sendingRequestUsers);
                        const showSendButton = !isFollower && !isRequested;

                        return (
                          <div
                            key={user._id}
                            className="flex justify-between items-center p-2 hover:bg-base-200/70 transition rounded-md mx-1"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={user.profilePicture || avtatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                              <div className="flex flex-col">
                                <span className="font-semibold text-sm truncate max-w-[120px]">{user.name}</span>
                                <span className="text-xs text-gray-500 truncate max-w-[140px]">{user.email}</span>
                              </div>
                            </div>
                            {showSendButton && (
                              <button
                                className="btn btn-xs btn-primary rounded-full"
                                onClick={() => handleSendRequest(user._id)}
                              >
                                <Send className="size-4" />
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                <User className="size-5" />
                <span className="hidden sm:inline relative">Profile</span>
                {pendingRequestUsersCount > 0 && (
                  <div className="badge badge-primary badge-lg absolute top-0 right-0">{pendingRequestUsersCount}</div>
                )}

              </Link>

              <button className="flex gap-2 items-center" onClick={logout}>
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}

          <Link to={"/settings"} className="btn btn-sm gap-2 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
