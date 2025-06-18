import mongoose from "mongoose"

const mongooseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    pendingRequestIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
}, { timestamps: true });

const PendingRequest = mongoose.model('PendingRequest', mongooseSchema);

export default PendingRequest;