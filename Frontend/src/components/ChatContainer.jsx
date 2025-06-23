import { useEffect } from 'react';
import { useChatStore } from '../StoreValues/useChat.Store';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageseSkelton from './skelton/messageseSkelton';
import { useAuth } from '../StoreValues/useAuth.Store';

const ChatContainer = () => {
    const { selectedUser, getMessages, messages, isMessagesLoading } = useChatStore();
    const { authuser } = useAuth();

    const avatarFallback = "/avatar.png";

    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser?._id]);

    if (!selectedUser) {
        return <div className="flex-1 flex items-center justify-center text-gray-500">Select a user to start chat</div>;
    }

    if (isMessagesLoading) {
        return (
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader />
                <MessageseSkelton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className='flex-1 flex flex-col overflow-auto'>
            <ChatHeader />
            <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
                {messages.map((message) => {
                    const isOwn = message.senderId === authuser._id;
                    return (
                        <div key={message._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className='flex items-end gap-2'>
                                {!isOwn && (
                                    <img
                                        src={selectedUser.profilePic || avatarFallback}
                                        alt="Avatar"
                                        className="w-8 h-8 rounded-full border"
                                    />
                                )}
                                <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                                    {message.text}
                                    <div className="text-[10px] opacity-60 mt-1 text-right">{message.createdAt}</div>
                                </div>
                                {isOwn && (
                                    <img
                                        src={authuser.profilePicture || avatarFallback}
                                        alt="Avatar"
                                        className="w-8 h-8 rounded-full border"
                                    />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <MessageInput />
        </div>
    );
};

export default ChatContainer;
