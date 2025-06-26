import { useEffect, useState } from "react";
import { useChatStore } from "../StoreValues/useChat.Store";
import { useAuth } from "../StoreValues/useAuth.Store";
import SidebarSkeleton from "./skelton/SidebarSkelton.jsx";
import { X } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const {
    getFollowedUser,
    user,
    selectedUser,
    isUserLoading,
    setSelectedUser,
  } = useChatStore();
  const { onlineUsers } = useAuth();

  useEffect(() => {
    getFollowedUser();
  }, []);

  const followedUsers = user || [];
  const filteredUsers = showOnlineOnly
    ? followedUsers.filter((u) => onlineUsers.includes(u._id))
    : followedUsers;

  if (isUserLoading) return <SidebarSkeleton />;

  return (
    <aside
      className={`
        fixed lg:static top-24 left-0 h-[calc(100vh-6rem)] 
        z-40 transition-transform duration-300 bg-base-100
        w-72 border-r border-base-300 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0
      `}
    >
      {/* ✅ Close button only on mobile */}
      <div className="flex lg:hidden justify-end p-3 border-b border-base-300">
        <button onClick={onClose}>
          <X className="text-xl" />
        </button>
      </div>

      {/* 🔷 Header for Contacts */}
      <div className="border-b border-base-300 w-full px-5 py-3 hidden lg:block">
        <div className="flex items-center gap-2">
          <span className="font-medium">Contacts</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      {/* 🔷 Follower List */}
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user);
              onClose(); // close on mobile tap
            }}
            className={`w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-10 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
              )}
            </div>
            <div className="text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
