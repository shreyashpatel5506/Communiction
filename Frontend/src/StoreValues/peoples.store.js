import { axiosInstance } from "../lib/axios";
import { create } from "zustand";

export const usePeoples = create((set) => ({
    followers: [],
    allusers: [],
    isLoadingFollowers: true,
    isLoadingAllUsers: true,
    pendingrequestUsers: [],
    isLoadingPendingRequest: true,
    sendingRequestUsers: [],
    isLoadingSendingRequest: true,

    fetchFollowers: async () => {
        try {
            set({ isLoadingFollowers: true });
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
                set({ followers: simplifiedFollowers });
            } else {
                set({ followers: [] });
            }
        } catch (error) {
            console.log(error);
        } finally {
            set({ isLoadingFollowers: false });
        }
    },

    fetchAllUsers: async (search) => {
        try {
            set({ isLoadingAllUsers: true });
            const res = await axiosInstance.get('/message/alluser', { params: { search } });
            set({ allusers: res.data.alluser });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isLoadingAllUsers: false });
        }
    },
    fetchPendingRequest: async () => {
        try {
            set({ isLoadingPendingRequest: true });
            const res = await axiosInstance.get('/follower/get-pendingrequestuser');
            const pendingRequest = res.data.pendingrequest;
            set({ pendingrequestUsers: pendingRequest });
            console.log("Pending Request:", pendingRequest);
        } catch (error) {
            console.log(error);
        } finally {
            set({ isLoadingPendingRequest: false });
        }
    },

    fetchSendingRequest: async () => {
        try {
            set({ isLoadingSendingRequest: true });
            const res = await axiosInstance.get('/follower/get-sendingrequestuser');
            const pending = usePeoples.getState().pendingrequestUsers;
            const pendingIds = new Set(pending.map(u => u._id));

            // Filter out users who are already in pending request
            const filteredSending = res.data.sendingrequest.filter(
                (u) => !pendingIds.has(u._id)
            );
            console.log("Sending Request:", filteredSending);

            set({ sendingRequestUsers: filteredSending });
        } catch (error) {
            console.log(error);
        } finally {
            set({ isLoadingSendingRequest: false });
        }
    },
    sendFollowRequest: async (reciverId) => {
        try {
            const res = await axiosInstance.post('/follower/send-request', { usersendrequestId: reciverId });
            console.log(res.data.message);
        } catch (error) {
            console.log(error);
        }
    },
    acceptFollowRequest: async (userId) => {
        try {
            const res = await axiosInstance.post('/follower/accept-request', { acceptrequestId: userId });
            console.log(res.data.message);
        } catch (error) {
            console.log(error);
        }
    },
    rejectFollowRequest: async (userId) => {
        try {
            const res = await axiosInstance.post('/follower/reject-request', { rejectrequestId: userId });
            console.log(res.data.message);
        } catch (error) {
            console.log(error);
        }
    },

})
);