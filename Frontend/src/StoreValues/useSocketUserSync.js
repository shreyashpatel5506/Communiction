import { useEffect } from "react";
import { useAuth } from "./useAuth.Store";
import { usePeoples } from "./peoples.store";

export function useSocketUserSync() {
    const { socket } = useAuth();
    const { fetchFollowers, fetchPendingRequest, fetchSendingRequest } = usePeoples();

    useEffect(() => {
        if (!socket) return;
        const handler = () => {
            fetchFollowers();
            fetchPendingRequest();
            fetchSendingRequest();
        };
        socket.on("refreshUserData", handler);
        return () => socket.off("refreshUserData", handler);
    }, [socket, fetchFollowers, fetchPendingRequest, fetchSendingRequest]);
}