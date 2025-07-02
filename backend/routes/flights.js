import Router from 'express';
import Flight from '../models/Flight.js';
import verifyAdmin from '../middlewares/adminMiddleware.js';
import verifyCharter from '../middlewares/charterMiddleware.js';
import AircraftType from '../models/AircraftType.js';
import BookedFlight from '../models/BookedFlight.js';

const router = Router();


router.post('/', verifyCharter, async(req, res) => {

    try {
        const {
            charter_provider_id, airplane, flight_number,
            source, source_city, destination, destination_city,
            departure_date, departure_time, arrival_date, arrival_time,
            fly_time, public_seats, charter_seats, price, status
        } = req.body;

        const aircraftType = await AircraftType.findById(airplane);
        if (!aircraftType) {
            return res.status(404).json({ message: "This plane doesn't exist." });
        }


        const initialSeats = aircraftType.seatsConfiguration.map(seat => ({
            seatNumber: seat.seatNumber,
            status: 'available',
            bookedBy: null,
            bookingType: null 
        }));

        const flight = new Flight({
            charter_provider_id, aircraftType: aircraftType._id,  flightNumber: flight_number, source, source_city,
            destination, destination_city, departure_date, departure_time, arrival_date, arrival_time,
            fly_time, number_of_seats: aircraftType.totalCapacity, public_seats, charter_seats, 
            price, status, seats: initialSeats 
        });

        const savedFlight = await flight.save();

        res.status(201).json(savedFlight);
    }
    catch(e) {
        return res.status(500).json({ message: "Server error", error: e.message });
    }
});

router.put('/:id', verifyCharter, async(req, res) => {

    try {

        const updatedFlight = await Flight.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        return res.status(200).json(updatedFlight);
    }
    catch(e) {

        return res.status(500).json(e);
    }
})

router.delete('/:id', verifyCharter, async(req, res) => {

    try {

        const deletedFlight = await Flight.findByIdAndDelete(req.params.id);

        if(!deletedFlight) {
            return res.status(404).json({message: "Flight not found"});
        }

        await BookedFlight.updateMany({flight_id: req.params.id}, { $unset : {flight_id: ""}});

        res.status(200).json( {message: "Flight deleted"} );
    }
    catch(e) {

        res.status(500).json( {message: "Server error"} );
    }
})

router.get('/', verifyCharter, async(req, res) => {

    try{

        const flights = await Flight.find();

        return res.status(200).json(flights);
    }
    catch(e) {

        return res.status(500).json({message: "Server error."});
    }
})

router.get('/charter-flights/:id', verifyCharter, async(req, res) => {

        try{

        const flights = await Flight.find({charter_provider_id: req.params.id});

        return res.status(200).json(flights);
    }
    catch(e) {

        return res.status(500).json({message: "Server error."});
    }
})

router.get('/:id', async(req, res) => {

    try{

        const flights = await Flight.findById(req.params.id).populate("aircraftType");

        return res.status(200).json(flights);
    }
    catch(e) {

        return res.status(500).json({message: "Server error."});
    }
})

router.get('/:from/:to/:departure_date/:return_date/:passagers', async(req, res) => {
    try {
        const { from, to, departure_date, passagers, return_date } = req.params;

        let query = {};

        if (from) query.source_city = from;
        if (to) query.destination_city = to;
        if (departure_date) query.departure_date = departure_date;
        if (passagers) query.number_of_seats = { $gt: passagers - 1 };

        const goFlights = await Flight.find(query);

        if (return_date !== "none") {
            query.source_city = to;
            query.destination_city = from;
            query.departure_date = return_date;

            const returnFlights = await Flight.find(query);

            return res.status(200).json({ goFlights, returnFlights });
        } else {
            return res.status(200).json({goFlights});
        }
    } catch (e) {
        return res.status(500).json(e);
    }
});

router.get('/charter-stats/:id', verifyCharter, async(req, res) => {

    try {

        const flights = await Flight.find({charter_provider_id: req.params.id});

        const totalFlights = flights.length;

        const bookedSeats = flights.reduce((acc, flight) => {
            const occupied = flight.number_of_seats - flight.public_seats - flight.charter_seats;
            return acc + occupied;
        }, 0);

        return res.status(200).json({
            totalFlights,
            bookedSeats
        });

    }
    catch(e) {

        return res.status(500).json(e);
    }
});


export default router;