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

            const followersArray = res.data.followers;
            if (followersArray.length > 0) {
                const followingIds = followersArray[0].followingIds;

                // ✅ Include required fields matching frontend usage
                const simplifiedFollowers = followingIds.map(follower => ({
                    _id: follower._id,
                    fullName: follower.name, // renamed to match frontend
                    email: follower.email,
                    profilePic: follower.profilePicture // renamed to match frontend
                }));

                console.log("Simplified Followers:", simplifiedFollowers);
                set({ user: simplifiedFollowers });
            } else {
                set({ user: [] });
            }
        } catch (error) {
            console.log(error);
        } finally {
            set({ isUserLoading: false }); // ✅ fixed: should be `isUserLoading`, not `isLoadingFollowers`
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
    },

    SetselectedUSer: (selectedUser) => {
        set({ selectedUser })
    }
}));