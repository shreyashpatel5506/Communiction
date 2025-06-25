import React, { useState, useEffect } from 'react';
import { useAuth } from '../StoreValues/useAuth.Store';
import { Link } from 'react-router-dom';
import { MessageSquare, Settings, User, LogOut, Send, Menu } from 'lucide-react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
  }, [searchQuery]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleSendRequest = async (userId) => await sendFollowRequest(userId);
  const isUserInList = (userId, list) => list.some(user => user._id === userId);
  const pendingRequestUsersCount = (pendingRequestUsers || []).length;

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {/* Top navbar with menu button */}
      <header className="bg-base-100 shadow-md border-b border-base-300 fixed w-full z-50 backdrop-blur-lg bg-base-100/80">
        <div className="container mx-auto flex justify-between items-center px-4 py-4 h-16">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden btn btn-ghost btn-sm">
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/" className="flex items-center gap-2 hover:opacity-80">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold">Chatty</span>
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            {authuser && (
              <>
                <input
                  type="text"
                  placeholder="Search users..."
                  className="input input-bordered input-sm w-64"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Link to="/profile" className="btn btn-sm relative">
                  <User className="size-5" />
                  {pendingRequestUsersCount > 0 && (
                    <div className="badge badge-primary badge-lg absolute -top-2 -right-2">
                      {pendingRequestUsersCount}
                    </div>
                  )}
                </Link>
                <button className="btn btn-sm" onClick={logout}>
                  <LogOut className="size-5" />
                </button>
              </>
            )}
            <Link to="/settings" className="btn btn-sm">
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar Drawer */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={closeSidebar}
      ></div>

      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-base-100 shadow-lg z-50 transform transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="p-4 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Menu</h2>
            <button onClick={closeSidebar} className="btn btn-ghost btn-sm">
              ✕
            </button>
          </div>

          {authuser && (
            <>
              <input
                type="text"
                placeholder="Search users..."
                className="input input-bordered input-sm w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />

              {showDropdown && allusers.length > 0 && (
                <div className="border border-base-300 rounded-lg max-h-48 overflow-auto">
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
                          className="flex justify-between items-center p-2 hover:bg-base-200 transition rounded"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={user.profilePicture || avtatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
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

              <Link to="/profile" className="btn btn-outline btn-sm w-full" onClick={closeSidebar}>
                <User className="size-4 mr-2" /> Profile
              </Link>

              <Link to="/settings" className="btn btn-outline btn-sm w-full" onClick={closeSidebar}>
                <Settings className="size-4 mr-2" /> Settings
              </Link>

              <button className="btn btn-error btn-sm w-full" onClick={() => { logout(); closeSidebar(); }}>
                <LogOut className="size-4 mr-2" /> Logout
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  );
};


export default Navbar;
