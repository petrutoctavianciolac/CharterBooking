import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{

    firstName: {

        type: String,
        required: true
    },

    lastName: {

        type: String,
        required: true
    },

    email: {

        type: String,
        required: true,
        unique: true
    },

    hash_password: {

        type: String,
        required: true
    },

    isAdmin: {

        type: Boolean,
        default: false
    }


}, {timestamps: true});

export default mongoose.model("User", userSchema);