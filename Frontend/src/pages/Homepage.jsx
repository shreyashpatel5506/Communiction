import { useState } from "react";
import ChatContainer from "../components/ChatContainer.jsx";
import SideBar from "../components/SideBar";
import { useChatStore } from "../StoreValues/useChat.Store.js";
import NoChatselected from "../components/NoChatSelected.jsx";
import { Users } from "lucide-react";

const Homepage = () => {
  const { selectedUser } = useChatStore();
  const [isContactsSidebarOpen, setIsContactsSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-base-200 overflow-hidden">
      {/* Contacts toggle - only on small screens, placed just below navbar */}
      <div className="lg:hidden fixed top-16 left-0 w-full z-40 bg-base-100 px-4 py-2 border-b border-base-300">
        <button onClick={() => setIsContactsSidebarOpen(true)} className="flex items-center gap-2">
          <Users className="size-5" />
          <span className="font-medium">Contacts</span>
        </button>
      </div>

      {/* Main Chat App Area */}
      <div className="pt-24 flex items-center justify-center px-4 h-full">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-6rem)] relative">
          <div className="flex h-full rounded-lg overflow-hidden">
            {/* Sidebar with contact toggle */}
            <SideBar isOpen={isContactsSidebarOpen} onClose={() => setIsContactsSidebarOpen(false)} />

            {/* Main chat container */}
            <div className="flex-1 overflow-hidden">
              {!selectedUser ? <NoChatselected /> : <ChatContainer />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
