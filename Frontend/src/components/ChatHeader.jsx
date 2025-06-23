import { X } from "lucide-react";
import { useAuth } from "../StoreValues/useAuth.Store";
import { useChatStore } from "../StoreValues/useChat.Store";

const ChatHeader = () => {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuth();

    if (!selectedUser) return null;

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="w-10 h-10 rounded-full relative overflow-hidden">
                            <img
                                src={selectedUser.profilePic || "/avatar.png"}
                                alt={selectedUser.fullName}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium">{selectedUser.fullName}</h3>
                        <p className="text-sm text-base-content/70">
                            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="hover:text-red-500">
                    <X />
                </button>
            </div>
        </div>
    );
};

export default ChatHeader;
