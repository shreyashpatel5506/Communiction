import ChatContainer from "../components/ChatContainer.jsx";
import SideBar from "../components/SideBar";
import { useChatStore } from "../StoreValues/useChat.Store.js"
import NoChatselected from "../components/NoChatSelected.jsx"

const Homepage = () => {

  const { selectedUser } = useChatStore();

  return (
    <div className="h-max bg-base-200">
      <div className="flex item-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh - 8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <SideBar />

            {!selectedUser ? <NoChatselected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage