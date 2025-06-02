import Follower from "../models/follwer.user.model.js";
import Message from "../models/message.model.js";
import user from "../models/user.model.js";

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
    const alluser = await user.find({_id:{$ne:userId}});
    res.status(200).json({
      message:"All users fetched",
      success:true,
      alluser,
    });
  }catch(error){
    res.status(500).json({message:error.message});
  }
}