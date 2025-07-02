import mongoose from "mongoose"

const passagerSchema = new mongoose.Schema(
{
    booking_id: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "BookedFlight",
        required: true
    },

    first_name: {

        type: String,
        required: true
    },

    last_name: {

        type: String,
        required: true
    },

    document: {

        type: String,
        required: true
    },

    personal_id: {

        type: String,
        required: true
    },

    birthdate: {

        type: Date,
        required: true
    }

}, {timestramp: true});

export default mongoose.model("Passager", passagerSchema);