import mongoose from "mongoose";


const seatConfigurationSchema = new mongoose.Schema({
    seatNumber: { type: String, required: true },
    row: { type: Number, required: true },       
    column: { type: String, required: true },    
    isAisle: { type: Boolean, default: false },  
    isWindow: { type: Boolean, default: false }, 
    isExitRow: { type: Boolean, default: false }, 

});

const aircraftTypeSchema = new mongoose.Schema({
    modelName: { 
        type: String,
        required: true,
        unique: true
    },
    manufacturer: { 
        type: String,
        required: true
    },
    totalCapacity: { 
        type: Number,
        required: true
    },
    rows: { 
        type: Number,
        required: true
    },
    columns: { 
        type: [String], 
        required: true
    },
    
    seatsConfiguration: [seatConfigurationSchema]
}, {
    timestamps: true 
});

export default mongoose.model("AircraftType", aircraftTypeSchema);