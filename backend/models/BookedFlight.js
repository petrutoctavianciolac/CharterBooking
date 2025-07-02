import mongoose from "mongoose";

const bookedFlightSchema = new mongoose.Schema(
{
    
    flight_id: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Flight",
        required: true
    },

    user_id: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    total_price: {

        type: Number,
        required: true
    },

    ticket_price: {

        type: Number,
        required: true
    },

    number_of_seats: {

        type: Number,
        required: true
    },

    seats: [{
        type: String,
        required: true
    }],

    passagers: [{

        name: { type: String, required: true},
        personal_id: {type: String, required: true},
        birthdate: {type: Date, required: true},
        gender: {type: String, required: true, enum: ["Male", "Female", "Other"]},
        baggage: {type: String, enum: ["Carry-on", "Carry-on + 10KG", "Carry-on + 15KG"], default: "Carry-on"},
        additional_price: {type: Number, enum: [0, 8, 11], default: 0}
    }],

    status: {

        type: String,
        enum: ["Active", "Completed", "Cancelled", "Expired"],
        default: "Active"
    },

    booked_at: {

        type: Date,
        default: Date.now
    },

    booking_type: {
        type: String,
        enum: ["public", "package"], 
        required: true
    },

    package_code_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PackageCode",
        required: false 
    }
}, {timestamps: true});

export default mongoose.model("BookedFlight", bookedFlightSchema);