import { useEffect } from 'react'
import { useChatStore } from '../StoreValues/useChat.Store'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageseSkelton from './skelton/messageseSkelton';
const ChatContainer = () => {
    const { selectedUser, getMessages, messagese, isMessagesLoading } = useChatStore();

    useEffect(() => {
        getMessages(selectedUser._id)
    }, [selectedUser._id, getMessages])

    if (isMessagesLoading) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader />
                <MessageseSkelton />
                <MessageInput />

            </div>
        )
    }
    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />

            <p> Messaging.. </p>

            <MessageInput />
        </div>

    )

}

export default ChatContainer