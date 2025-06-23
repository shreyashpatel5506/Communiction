import Follower from "../models/follwer.user.model.js";
import PendingRequest from "../models/pendingrequest.js";
import SendingRequest from "../models/sendingrequest.js";
import Message from "../models/message.model.js";
import user from "../models/user.model.js";
import claudinary from "../lib/cloudinary.js";

// Fetch followers of the current user
export const fetchfollowersuser = async (req, res) => {
  try {
    const userId = req.user._id;
    const followers = await Follower.find({ userId }).populate('followingIds');
    res.status(200).json({
      message: "Followers fetched",
      success: true,
      followers, // typo fixed (was "follwers")
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all users except the current one, with optional search
// ✅ Update fetchalluser in your controller
export const fetchalluser = async (req, res) => {
  try {
    const userId = req.user._id;
    const search = req.query.search;

    // Get all exclusion lists
    const [followers, pendingRequest, sendingRequest] = await Promise.all([
      Follower.findOne({ userId }),
      PendingRequest.findOne({ userId }),
      SendingRequest.findOne({ userId }),
    ]);

    const excludedIds = new Set();

    if (followers) followers.followingIds.forEach(id => excludedIds.add(id.toString()));
    if (pendingRequest) pendingRequest.pendingRequestIds.forEach(id => excludedIds.add(id.toString()));
    if (sendingRequest) sendingRequest.sendingRequestIds.forEach(id => excludedIds.add(id.toString()));

    excludedIds.add(userId.toString()); // Don't show current user

    const query = { _id: { $nin: Array.from(excludedIds) } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const alluser = await user.find(query);
    res.status(200).json({
      message: "All users fetched",
      success: true,
      alluser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Send a message (with optional image)
export const sendmessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const reciverId = req.params.id; // ✅ correct

    const { text, image } = req.body;

    let imageurl;
    if (image) {
      const uploadresponse = await claudinary.uploader.upload(image);
      imageurl = uploadresponse.secure_url;
    }

    const message = new Message({
      senderId,
      receiverId: reciverId, // ✅ match schema field
      text,
      image: imageurl,
    });

    await message.save();

    res.status(200).json({
      message,
      success: true,
    });
  } catch (error) {
    return res.status(500).send("Error: " + error.message);
  }
};


// Fetch chat messages between current user and another user
export const getmessage = async (req, res) => {
  try {
    const myid = req.user._id;
    const { id: chatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myid, reciverId: chatId },
        { senderId: chatId, reciverId: myid },
      ],
    });

    res.status(200).json({
      message: "Messages fetched",
      success: true,
      messages,
    });
  } catch (error) {
    return res.status(500).send("Error: " + error.message);
  }
};
