import PendingRequest from "../models/pendingrequest.js";
import SendingRequest from "../models/sendingrequest.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
import dns from "dns/promises";
import User from "../models/user.model.js";
import Follower from "../models/follwer.user.model.js";
import { io, getReciverSocketId } from "../lib/socket.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MY_MAIL,
        pass: process.env.MY_PASSWORD,
    },
});
// Send follow request
export const sendingfollowingrequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const { usersendrequestId } = req.body;

        if (!usersendrequestId) {
            return res.status(400).json({ message: "Target user ID is required." });
        }

        // ✅ Prevent self request
        if (userId.toString() === usersendrequestId) {
            return res.status(400).json({ message: "You cannot send a request to yourself." });
        }

        const targetUser = await User.findById(usersendrequestId);
        if (!targetUser) {
            return res.status(404).json({ message: "User does not exist." });
        }

        // ✅ Prevent if already following
        const existingFollower = await Follower.findOne({ userId });
        if (existingFollower && existingFollower.followingIds.includes(usersendrequestId)) {
            return res.status(400).json({ message: "You already follow this user." });
        }

        // ✅ Prevent if already sent
        const existingRequest = await SendingRequest.findOne({ userId });
        if (existingRequest && existingRequest.sendingRequestIds.includes(usersendrequestId)) {
            return res.status(400).json({ message: "Request already sent." });
        }

        const sender = await User.findById(userId);
        const email = targetUser.email;
        const mailOptions = {
            from: `PulseTalk <${process.env.MY_MAIL}>`,
            to: email,
            subject: "New Follow Request on PulseTalk",
            html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f4f6fa; padding: 40px 0;">
              <div style="max-width: 480px; background: #ffffff; border-radius: 12px; margin: auto; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
            <div style="background: linear-gradient(to right, #6C63FF, #5848D8); padding: 20px;">
              <h1 style="color: #fff; text-align: center; margin: 0;">PulseTalk</h1>
            </div>
            <div style="padding: 30px;">
              <h2 style="text-align: center; color: #333;">New Follow Request</h2>
              <p style="text-align: center; color: #666; font-size: 16px;">
                <strong>${sender?.name || "A user"}</strong> has sent you a follow request on PulseTalk.<br>
                Accept or reject the request to start a new experience!
              </p>
              <div style="margin-top: 30px; text-align: center;">
                <a href="#" style="background: linear-gradient(to right, #6C63FF, #8572FF); color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Go to PulseTalk
                </a>
              </div>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="font-size: 12px; color: #aaa; text-align: center;">
                If you did not expect this, you can safely ignore this email.<br><br>
                — The PulseTalk Team 💬
              </p>
            </div>
              </div>
            </div>
            `,
        };
        transporter.sendMail(mailOptions, (err, info) => {
            // Optionally log or handle errors, but don't block the response
        });
        // Add to sending request
        let sendingRequest = existingRequest;
        if (!sendingRequest) {
            sendingRequest = new SendingRequest({
                userId,
                sendingRequestIds: [usersendrequestId],
            });
        } else {
            sendingRequest.sendingRequestIds.push(usersendrequestId);
        }

        // Add to pending request
        let pendingRequest = await PendingRequest.findOne({ userId: usersendrequestId });
        if (!pendingRequest) {
            pendingRequest = new PendingRequest({
                userId: usersendrequestId,
                pendingRequestIds: [userId],
            });
        } else if (!pendingRequest.pendingRequestIds.includes(userId)) {
            pendingRequest.pendingRequestIds.push(userId);
        }

        await sendingRequest.save();
        await pendingRequest.save();

        // Notify the target user about the new request
        const targetSocketId = getReciverSocketId(usersendrequestId);
        if (targetSocketId) {
            io.to(targetSocketId).emit("refreshUserData");
        }

        return res.status(200).json({ message: "Request sent successfully", success: true });
        // Send email notification to the target user about the follow request

        // End of email sending logic
        await transporter.sendMail(mailOptions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const acceptrequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const { acceptrequestId } = req.body;

        const requestUser = await User.findById(acceptrequestId);
        if (!requestUser) {
            return res.status(404).json({ message: "User does not exist." });
        }

        // ✅ Check pending request
        const pendingRequest = await PendingRequest.findOne({ userId });
        if (!pendingRequest || !pendingRequest.pendingRequestIds.includes(acceptrequestId)) {
            return res.status(400).json({ message: "No pending request from this user." });
        }

        // ✅ Remove from pending requests
        pendingRequest.pendingRequestIds = pendingRequest.pendingRequestIds.filter(
            id => id.toString() !== acceptrequestId
        );
        await pendingRequest.save();

        // ✅ Remove from sending requests of sender using .equals()
        const sendingRequest = await SendingRequest.findOne({ userId: acceptrequestId });
        if (sendingRequest) {
            sendingRequest.sendingRequestIds = sendingRequest.sendingRequestIds.filter(
                id => !id.equals(userId) // <-- fixed comparison here
            );
            await sendingRequest.save();
        }

        // ✅ Add both users to each other’s followers list
        const addFollower = async (fromId, toId) => {
            let follower = await Follower.findOne({ userId: fromId });
            if (follower) {
                if (!follower.followingIds.includes(toId)) {
                    follower.followingIds.push(toId);
                    await follower.save();
                }
            } else {
                const newFollower = new Follower({
                    userId: fromId,
                    followingIds: [toId],
                });
                await newFollower.save();
            }
        };

        await addFollower(userId, acceptrequestId);
        await addFollower(acceptrequestId, userId);

        // Notify both users to refresh their data
        const targetSocketId = getReciverSocketId(acceptrequestId);
        if (targetSocketId) {
            io.to(targetSocketId).emit("refreshUserData");
        }
        const selfSocketId = getReciverSocketId(userId);
        if (selfSocketId) {
            io.to(selfSocketId).emit("refreshUserData");
        }

        return res.status(200).json({ message: "Request accepted", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Reject follow request
export const rejectrequest = async (req, res) => {
    try {
        const userId = req.user._id;
        const { rejectrequestId } = req.body;

        const targetUser = await User.findById(rejectrequestId);
        if (!targetUser) {
            return res.status(404).json({ message: "User does not exist." });
        }

        const pendingRequest = await PendingRequest.findOne({ userId });
        if (!pendingRequest || !pendingRequest.pendingRequestIds.includes(rejectrequestId)) {
            return res.status(400).json({ message: "No such pending request." });
        }

        pendingRequest.pendingRequestIds = pendingRequest.pendingRequestIds.filter(
            id => id.toString() !== rejectrequestId
        );
        await pendingRequest.save();

        // Remove from sending requests of sender
        const sendingRequest = await SendingRequest.findOne({ userId: rejectrequestId });
        if (sendingRequest) {
            sendingRequest.sendingRequestIds = sendingRequest.sendingRequestIds.filter(
                id => !id.equals(userId)
            );
            await sendingRequest.save();
        }

        // Notify both users to refresh their data
        const targetSocketId = getReciverSocketId(rejectrequestId);
        if (targetSocketId) {
            io.to(targetSocketId).emit("refreshUserData");
        }
        const selfSocketId = getReciverSocketId(userId);
        if (selfSocketId) {
            io.to(selfSocketId).emit("refreshUserData");
        }

        return res.status(200).json({ message: "Request rejected", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Unfollow a user
export const unfollowuser = async (req, res) => {
    try {
        const userId = req.user._id;
        const { unfollowuserId } = req.body;

        const targetUser = await User.findById(unfollowuserId);
        if (!targetUser) {
            return res.status(404).json({ message: "User does not exist." });
        }

        const follower = await Follower.findOne({ userId });
        if (!follower || !follower.followingIds.includes(unfollowuserId)) {
            return res.status(400).json({ message: "You are not following this user." });
        }

        follower.followingIds = follower.followingIds.filter(
            id => id.toString() !== unfollowuserId
        );
        await follower.save();

        // Notify both users to refresh their data
        const targetSocketId = getReciverSocketId(unfollowuserId);
        if (targetSocketId) {
            io.to(targetSocketId).emit("refreshUserData");
        }
        const selfSocketId = getReciverSocketId(userId);
        if (selfSocketId) {
            io.to(selfSocketId).emit("refreshUserData");
        }

        return res.status(200).json({ message: "Unfollowed successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get users who sent a pending request to me
export const getpendingrequestusers = async (req, res) => {
    try {
        const userId = req.user._id;
        const pendingRequest = await PendingRequest.findOne({ userId }).populate('pendingRequestIds');
        res.status(200).json({
            message: "Pending request users fetched",
            success: true,
            pendingrequest: pendingRequest?.pendingRequestIds || [],
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get users I sent request to
export const getsendingrequestuser = async (req, res) => {
    try {
        const userId = req.user._id;
        const sendingRequest = await SendingRequest.findOne({ userId }).populate('sendingRequestIds');
        res.status(200).json({
            message: "Sending request users fetched",
            success: true,
            sendingrequest: sendingRequest?.sendingRequestIds || [],
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Get all followers of the authenticated user