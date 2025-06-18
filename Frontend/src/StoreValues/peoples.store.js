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
            set({ followers: res.data.followers });
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
            const pendingRequest = res.data.pendingrequest.pendingRequestIds;
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

            set({ sendingRequestUsers: res.data.sendingrequest.sendingRequestIds });
            const data = res.data.sendingrequest.sendingRequestIds;
            console.log("Sending Request:", data);
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