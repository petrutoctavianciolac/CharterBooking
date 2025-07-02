import mongoose from 'mongoose';

const packageCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true, 
        index: true 
    },
    flightId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        required: true
    },
    seatsAllocated: { 
        type: Number,
        required: true,
        default: 1
    },
    isUsed: { 
        type: Boolean,
        default: false
    },
    usedByBooking: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking' 
    },
    usedAt: { 
        type: Date
    }
}, {
    timestamps: true 
});

export default mongoose.model('PackageCode', packageCodeSchema);