import Follower from "../models/follwer.user.model.js";
import Message from "../models/message.model.js";
import user from "../models/user.model.js";
import claudinary from "../lib/cloudinary.js";

//for the followers user fetch
export const fetchfollowersuser= async(req , res) =>{
  try{
    const userId = req.user._id;
    const follwers = await Follower.find({userId}).populate('followingIds');
    res.status(200).json({
      message:"Follwers fetched",
      success:true,
      follwers,
    });
  }catch(error){
    res.status(500).json({message:error.message});
  }
}

//for the alluser fetch
export const fetchalluser = async(req , res) =>{
  try{
    const userId = req.user._id;
    const searchQuery = req.query;
    const query = { _id: { $ne: userId } };

    if(searchQuery){
      query.$or = [
        {name:{$regex:search,$options:'i'}},
        {username:{$regex:searchQuery,$options:'i'}},
      ];
    }
    const alluser = await user.find(query);
    res.status(200).json({
      message:"All users fetched",
      success:true,
      alluser,
    });
  }catch(error){
    res.status(500).json({message:error.message});
  }
}

export const sendmessage = async ( req ,res)=>{
  try {
    const {senderId} = req.user._id;
    const {reciverId} = req.params;
    const {text} = req.body;
    const {image} = req.body;
    let imageurl;
    if(image){
      const uploadresponse = await cloudinary.uploader.upload(image)
      imageurl = uploadresponse.secure_url();
    }
    const message = new Message({
      senderId,
      reciverId,
      text,
      image:imageurl,
    });
    await message.save();
    res.status(200).json({
      message:"Message sent",
      success:true,
    });
  } catch (error) {
    return res.status(500).send("Error" + error.message);
  }
}

export const getmessage =  async (req, res) => {
  try {
    const myid= req.user._id;
    const {id : chatId} = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: myid, receiverId: chatId },
        { senderId: chatId, receiverId: myid },
      ],
    });
    res.status(200).json({
      message:"Messages fetched",
      success:true,
      messages,
    });
  } catch (error) {
    return res.status(500).send("Error" + error.message);
  }
}