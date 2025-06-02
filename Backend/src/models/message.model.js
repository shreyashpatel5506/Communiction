import mongoose from 'mongoose';

const mongooseSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    text:{
        type:String,
        
    },
    image:{
        type:String
    },
    read:{
        type:Boolean,
        default:false,
    }
},{timestamps:true});

const Message = mongoose.model('Message', mongooseSchema);

export default Message;
