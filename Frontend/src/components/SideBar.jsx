import React, { useEffect } from 'react'
import { useChatStore } from '../StoreValues/useChat.Store'
import SidebarSkeleton from "./skelton/SidebarSkelton.jsx"

const SideBar = () => {
    const { getFollowedUser, users, selectedUser, isUserLoading } = useChatStore();

    const onlineUser = []

    useEffect(() => {
        getFollowedUser()
    }, [getFollowedUser])

    if (isUserLoading) return <SidebarSkeleton />

    return (
        <aside className=''>

        </aside>
    )
}

export default SideBar