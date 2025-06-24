import { useEffect } from 'react';
import { useChatStore } from '../StoreValues/useChat.Store';
import SidebarSkeleton from "./skelton/SidebarSkelton.jsx";
import { Users } from 'lucide-react';

const SideBar = () => {
  const {
    getFollowedUser,
    user,
    selectedUser,
    isUserLoading,
    setSelectedUser
  } = useChatStore();

  useEffect(() => {
    getFollowedUser();
    // eslint-disable-next-line
  }, []);

  const followedUsers = user || [];

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside className='min-h-0 h-full w-20 lg:w-72 border-r border-base-300 flex flex-col'>
      {/* Top Header */}
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      {/* Scrollable user list */}
      <div className="flex-1 overflow-y-auto w-full py-3 min-h-0">
        {followedUsers.length > 0 ? (
          followedUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-blue-400" : ""
                }`}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName || "User"}
                  className="size-12 object-cover rounded-full"
                />
              </div>
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName || "Unnamed"}</div>
                <div className='text-sm text-zinc-400'>online</div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>

  );
};

export default SideBar;
