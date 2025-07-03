import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
{

    user_id: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    type: {

        type: String,
        required: true
    },

    valid_until: {

        type: Date,
        required: true
    },

    status: {

        type: String,
        default: "Active"
    },

    price: {

        type: Number,
        required: true
    },

    benefits: [{

        type: String,
        required: true
    }]
}, {timestamps: true});

export default mongoose.model("Subscription", subscriptionSchema);