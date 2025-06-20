import { create } from 'zustand'
import axiosInstance from '../api/axiosInstance'
import toast from 'react-hot-toast'

const useChatStore = create((set) => ({
    messages: [],
    user: [],
    isUserLoading: false,
    selectedUser: null,
    isMessagesLoading: false,

    getFollowedUser: async () => {
        try {
            const res = await axiosInstance.get('/message/follwers');
            set({ user: response.data })

        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false })
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