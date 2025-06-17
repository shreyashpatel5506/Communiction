import PendingRequest from "../models/pendingrequest.js";
import SendingRequest from "../models/sendingrequest.js";
import user from "../models/user.model.js"
import Follower from "../models/follwer.user.model.js";

export const sendingfollowingrequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const { usersendrequestId } = req.body;
        const users = await user.findById(usersendrequestId);
        if (!users) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const sendingRequest = new SendingRequest({
            userId: userId,
            SendingRequestIds: [usersendrequestId],
        });
        const pendingRequest = new PendingRequest({
            userId: usersendrequestId,
            PendingRequestIds: [userId],
        })
        if (sendingRequest) {
            await sendingRequest.save();
            await pendingRequest.save();
            return res.status(200).json({
                message: "Request sent",
                success: true,
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const acceptrequest = async (req, res) => {
    const userId = req.user._id;
    const { acceptrequestId } = req.body;
    const users = await user.findById(acceptrequestId);
    if (!users) {
        return res.status(400).json({ message: "User does not exist" });
    }
    const pendingRequest = await PendingRequest.findOne({ userId: acceptrequestId });
    if (!pendingRequest) {
        return res.status(400).json({ message: "Pending request does not exist" });
    }
    const isAlreadyAccepted = pendingRequest.PendingRequestIds.find(id => id.toString() === userId);
    if (isAlreadyAccepted) {
        return res.status(400).json({ message: "Request already accepted" });
    }
    // Remove acceptrequestId from PendingRequestIds
    pendingRequest.PendingRequestIds = pendingRequest.PendingRequestIds.filter(id => id.toString() !== userId);

    // Remove userId from SendingRequest.SendingRequestIds of the user who sent the request
    const sendingRequest = await SendingRequest.findOne({ userId: userId });
    if (sendingRequest) {
        sendingRequest.SendingRequestIds = sendingRequest.SendingRequestIds.filter(id => id.toString() !== acceptrequestId);
        await sendingRequest.save();
    }
    await pendingRequest.save();
    const follower = new Follower({
        userId: userId,
        followingIds: [acceptrequestId],
    });
    await follower.save();
    res.status(200).json({
        message: "Request accepted",
        success: true,
    });

}

export const rejectrequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const { rejectrequestId } = req.body;
        const users = await user.findById(rejectrequestId);
        if (!users) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const pendingRequest = await PendingRequest.findOne({ userId: rejectrequestId });
        if (!pendingRequest) {
            return res.status(400).json({ message: "Pending request does not exist" });
        }
        const isAlreadyRejected = pendingRequest.PendingRequestIds.find(id => id.toString() === userId);
        if (isAlreadyRejected) {
            return res.status(400).json({ message: "Request already rejected" });
        }
        // Remove rejectrequestId from PendingRequestIds
        pendingRequest.PendingRequestIds = pendingRequest.PendingRequestIds.filter(id => id.toString() !== userId);
        await pendingRequest.save();
        res.status(200).json({
            message: "Request rejected",
            success: true,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const unfollowuser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { unfollowuserId } = req.body;
        const users = await user.findById(unfollowuserId);
        if (!users) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const follower = await Follower.findOne({ userId: unfollowuserId });
        if (!follower) {
            return res.status(400).json({ message: "Follower does not exist" });
        }
        const isAlreadyUnfollowed = follower.followingIds.find(id => id.toString() === userId);
        if (!isAlreadyUnfollowed) {
            return res.status(400).json({ message: "User is not followed" });
        }
        // Remove unfollowuserId from followingIds
        follower.followingIds = follower.followingIds.filter(id => id.toString() !== userId);
        await follower.save();
        res.status(200).json({
            message: "User unfollowed",
            success: true,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getpendingrequestusers = async (req, res) => {

    try {
        const userId = req.user._id;
        const pendingRequest = await PendingRequest.findOne({ userId }).populate('PendingRequestIds');
        res.status(200).json({
            message: "Pending request users fetched",
            success: true,
            pendingRequest,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getsendingrequestuser = async (req, res) => {
    try {
        const userId = req.user._id;
        const sendingRequest = await SendingRequest.findOne({ userId }).populate('SendingRequestIds');
        res.status(200).json({
            message: "Sending request users fetched",
            success: true,
            sendingRequest,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

