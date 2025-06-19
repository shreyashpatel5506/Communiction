import { create } from 'zustand'
import axiosInstance from '../api/axiosInstance'
import toast from 'react-hot-toast'

const useChatStore = create((set) => ({
    messages: [],
    user: [],
    isUserLoading: false,
    selectedUser: null,
    isMessagesLoading: false,

    getFollowedUser: (async) => {
        try {

        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false })
        }
    }
}));