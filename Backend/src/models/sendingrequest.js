import mongoose from 'mongoose';

const mongooseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sendingRequestIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
}, { timestamps: true });

const SendingRequest = mongoose.model('SendingRequest', mongooseSchema);

export default SendingRequest;