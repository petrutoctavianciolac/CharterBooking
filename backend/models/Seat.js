import mongoose from "mongoose";

const seatSchema = new mongoose.Schema(
{

    flight_id: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Flight",
        required: true
    },

    seat_number: {

        type: String,
        required: true
    },

    seat_type: {

        type: String,
        enum: ["Economy", "Business"],
        default: "Economy"
    },

    seat_price: {

        type: Number,
        default: 5
    },

    available: {

        type: Boolean,
        default: true
    }

}, {timestamps: true});

export default mongoose.model("Seat", seatSchema);