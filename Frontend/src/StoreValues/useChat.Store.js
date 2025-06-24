import { create } from 'zustand';
import { axiosInstance } from "../lib/axios";
import toast from 'react-hot-toast';

export const useChatStore = create((set, get) => ({
    messages: [],
    user: [],
    isUserLoading: false,
    selectedUser: null,
    isMessagesLoading: false,

    getFollowedUser: async () => {
        try {
            set({ isUserLoading: true });
            const res = await axiosInstance.get('/message/follwers');
            const followersArray = res.data.followers;

            if (followersArray.length > 0) {
                const followingIds = followersArray[0].followingIds;
                const simplifiedFollowers = followingIds.map(follower => ({
                    _id: follower._id,
                    fullName: follower.name,
                    email: follower.email,
                    profilePic: follower.profilePicture
                }));
                set({ user: simplifiedFollowers });
            } else {
                set({ user: [] });
            }
        } catch (error) {
            console.log(error);
        } finally {
            set({ isUserLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/message/get-message/${userId}`);
            const messagesArray = Array.isArray(res.data.messages) ? res.data.messages : [];
            set({ messages: messagesArray });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch messages");
            set({ messages: [] });
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(
                `/message/send-message/${selectedUser._id}`,
                messageData
            );
            set({ messages: [...messages, res.data.message] });
        } catch (error) {
            console.log("Failed to send message:", error);
        }
    }
}));
