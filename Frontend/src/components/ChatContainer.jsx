import { useEffect, useRef } from 'react';
import { useChatStore } from '../StoreValues/useChat.Store';
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageseSkelton from './skelton/messageseSkelton';
import { useAuth } from '../StoreValues/useAuth.Store';


const ChatContainer = () => {
    const { selectedUser, getMessages, messages, isMessagesLoading, subscribeMessages, unsubscribeMessages } = useChatStore();
    const { authuser } = useAuth();
    const avatarFallback = "/avatar.png";
    const bottomRef = useRef(null);

    // Fetch messages on user select
    useEffect(() => {

        getMessages(selectedUser._id);

        subscribeMessages()

        return () => unsubscribeMessages();


    }, [selectedUser?._id, getMessages, subscribeMessages, unsubscribeMessages]);

    // Scroll to bottom when messages update
    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    if (!selectedUser) {
        return <div className="flex-1 flex items-center justify-center text-gray-500">Select a user to start chat</div>;
    }

    if (isMessagesLoading) {
        return (
            <div className='flex-1 flex flex-col overflow-hidden'>
                <ChatHeader />
                <MessageseSkelton />
                <MessageInput />
            </div>
        );
    }

    return (
        <div className='flex-1 flex flex-col overflow-hidden h-screen'>
            <ChatHeader />

            {/* Scrollable messages area */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((message) => {
                    const isOwn = message.senderId === authuser._id;
                    const profilePic = isOwn
                        ? authuser.profilePicture || avatarFallback
                        : selectedUser.profilePic || avatarFallback;

                    return (
                        <div
                            key={message._id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex items-end gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-full overflow-hidden border">
                                    <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
                                </div>

                                {/* Message Bubble */}
                                <div>
                                    <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm">
                                        {message.image && (
                                            <img
                                                src={message.image}
                                                alt="Message"
                                                className="rounded-lg mb-2 max-w-xs max-h-60"
                                            />
                                        )}
                                        {message.text && <p>{message.text}</p>}
                                    </div>

                                    {/* Timestamp */}
                                    <time className="text-xs text-gray-400 mt-1 block text-right">
                                        {new Date(message.createdAt).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        })}
                                    </time>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {/* This element ensures scroll reaches bottom */}
                <div ref={bottomRef} />
            </div>

            <MessageInput />
        </div>
    );
};

export default ChatContainer;
