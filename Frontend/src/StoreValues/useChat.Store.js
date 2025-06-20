import { create } from 'zustand'
import { axiosInstance } from "../lib/axios";
import toast from 'react-hot-toast'

export const useChatStore = create((set) => ({
    messages: [],
    user: [],
    isUserLoading: false,
    selectedUser: null,
    isMessagesLoading: false,

    getFollowedUser: async () => {
        try {
            set({ isUserLoading: true });
            const res = await axiosInstance.get('/message/follwers');

            // Check if followers array is not empty
            const followersArray = res.data.followers;
            if (followersArray.length > 0) {
                const followingIds = followersArray[0].followingIds;

                // Extract only the required fields: name, email, profilePicture
                const simplifiedFollowers = followingIds.map(follower => ({
                    name: follower.name,
                    email: follower.email,
                    profilePicture: follower.profilePicture
                }));

                console.log("Simplified Followers:", simplifiedFollowers);
                set({ user: simplifiedFollowers });
            } else {
                set({ user: [] });
            }
        } catch (error) {
            console.log(error);
        } finally {
            set({ isLoadingFollowers: false });
        }
    },
    getMessages: async (userId) => {
        try {
            const res = await axiosInstance.get('/message/get-message/{user.id}');
            set({ messages: response.data })
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    }
}));