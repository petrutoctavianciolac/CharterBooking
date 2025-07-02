import mongosee from 'mongoose';

const flightSchema = new mongosee.Schema(
{

    charter_provider_id: {

        type: mongosee.Schema.Types.ObjectId,
        ref: "CharterProvider",
        required: true
    },

    aircraftType: {

        type: mongosee.Schema.Types.ObjectId,
        ref: "AircraftType",
        required: true
    },

    flightNumber: {

        type: String, 
        required: true
    },

    source: {
        
        type: String,
        required: true
    },

    source_city: {
        
        type: String,
        required: true
    },

    destination: {
        
        type: String,
        required: true
    },

    destination_city: {
        
        type: String,
        required: true
    },

    departure_date: {
        
        type: Date,
        required: true
    },

    departure_time: {
        
        type: String,
        required: true
    },

    arrival_date: {
        
        type: Date,
        required: true
    },

    arrival_time: {
        
        type: String,
        required: true
    },

    fly_time : {

        type: String,
        required: true
    },

    number_of_seats: {

        type: Number,
        required: true
    },


    public_seats: {

        type: Number,
        required: true
    },

    charter_seats: {
    
        type: Number,
        required: true
    },

    price: {
        
        type: Number,
        required: true
    },

    status: {
        
        type: String,
        enum: ["Active", "Completed", "Cancelled"],
        default: "Active"
    },
    
    seats: [{
        seatNumber: { type: String, required: true },
        status: { type: String, enum: ['available', 'occupied', 'charter_reserved', 'package'], default: 'available' },
        bookedBy: { type: mongosee.Schema.Types.ObjectId, ref: 'User' }, 
        bookingType: { type: String, enum: ['public', 'charter', 'package'] }, 
    }]

}, {timestamps: true});

export default mongosee.model("Flight", flightSchema);