import mongoose from "mongoose";
const {Schema} = mongoose;

const ReviewSchema = new mongoose.Schema({
    plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
    },
    comment: String, 
    date: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("Review", ReviewSchema);