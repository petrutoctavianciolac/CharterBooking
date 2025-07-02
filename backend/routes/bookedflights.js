import Router from 'express';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import BookedFlight from '../models/BookedFlight.js';
import verifyToken from '../middlewares/authMiddlewares.js';
import verifyUser from '../middlewares/userMiddleware.js';
import verifyCharter from '../middlewares/charterMiddleware.js';
import verifyAdmin from '../middlewares/adminMiddleware.js';
import PackageCode from '../models/PackageCode.js';
import Flight from '../models/Flight.js';

const router = Router();

router.post('/public-booking', verifyToken, async(req, res) => {
    try {
        const { flight_id, user_id, numberOfTickets } = req.body;


        if (!flight_id || !user_id || !numberOfTickets || numberOfTickets <= 0) {
            return res.status(400).json({ message: "Incomplete data. flight_id, user_id and numberOfTickets are mandatory." });
        }
        if (user_id !== req.user.user_id) {
            return res.status(403).json({ message: "You are not allowed to do this" });
        }

        const flight = await Flight.findById(flight_id);
        if (!flight) {
            return res.status(404).json({ message: "Flight not found." });
        }


        if (flight.public_seats < numberOfTickets) {
            return res.status(400).json({ message: `Not enought tickets. There are ${flight.public_seats} available seats from ${flight.number_of_seats}.` });
        }

        flight.public_seats -= numberOfTickets;

        const ticketPrice = flight.price;
        const totalPrice = ticketPrice * numberOfTickets; 


        const booking = new BookedFlight({
            flight_id: flight_id,
            user_id: user_id,
            total_price: totalPrice,
            ticket_price: ticketPrice,
            number_of_seats: numberOfTickets,
            seats: [], 
            passagers: [], 
            booking_type: "public"
        });

        await flight.save();
        await booking.save();

        return res.status(201).json({ message: "Tickets reserved", bookingId: booking._id });

    } catch (e) {

        return res.status(500).json({ message: "Server error: ", error: e.message });
    }
});


router.post('/charter-booking', verifyToken, async (req, res) => {
    try {
        const { flight_id, user_id, packageCode } = req.body;


        if (!flight_id || !user_id || !packageCode) {
            return res.status(400).json({ message: "Incomplete data. flight_id, user_id and packageCode are mandatory." });
        }
        if (user_id !== req.user.user_id) {
            return res.status(403).json({ message: "You are not allowed to do this." });
        }

        const codeEntry = await PackageCode.findOne({
            code: packageCode,
            flightId: flight_id,
            isUsed: false
        });

        if (!codeEntry) {
            return res.status(400).json({ message: "Invalid Package Code." });
        }

        const numberOfTickets = codeEntry.seatsAllocated;


        const flight = await Flight.findById(flight_id);
        if (!flight) {
            return res.status(404).json({ message: "No flight found" });
        }

        if (flight.charter_seats < numberOfTickets) {
            return res.status(400).json({ message: `There are not enought seats. ${flight.charter_seats} remeined.` });
        }

        flight.charter_seats -= numberOfTickets;

        codeEntry.isUsed = true;
        codeEntry.usedAt = new Date();

        const ticketPrice = flight.price;
        const totalPrice = ticketPrice * numberOfTickets; 


        const booking = new BookedFlight({
            flight_id: flight_id,
            user_id: user_id,
            total_price: totalPrice,
            ticket_price: ticketPrice,
            number_of_seats: numberOfTickets,
            seats: [], 
            passagers: [], 
            booking_type: "package",
            package_code_id: codeEntry._id
        });

        await flight.save();
        await codeEntry.save();
        await booking.save();


        codeEntry.usedByBooking = booking._id;
        await codeEntry.save();

        return res.status(201).json({ message: "Tickets reserved with package.", bookingId: booking._id });

    } catch (e) {
        return res.status(500).json({ message: "Serer error: ", error: e.message });
    }
});

router.put('/:bookingId/add-passengers', verifyToken, async(req, res) => {
    try {
        const { bookingId } = req.params;
        const { passagers } = req.body;

        if (!passagers || !Array.isArray(passagers) || passagers.length === 0) {
            return res.status(400).json({ message: "All field are mandatory" });
        }

        const booking = await BookedFlight.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "No reservation found" });
        }

        if (booking.user_id.toString() !== req.user.user_id) {
            return res.status(403).json({ message: "You are not allowed to do this." });
        }

        if (passagers.length !== booking.number_of_seats) {
            return res.status(400).json({ message: `You have to add details for ${booking.number_of_seats} pasagers.` });
        }

        if (booking.passagers && booking.passagers.length > 0) {
            return res.status(400).json({ message: "Passagers already added." });
        }

        const additionalPricesTotal = passagers.reduce((total, passager) => {

            return total + (typeof passager.additional_price === 'number' ? passager.additional_price : 0);
        }, 0);

        booking.total_price += additionalPricesTotal;
        booking.passagers.push(...passagers); 

        await booking.save();

        return res.status(200).json({ message: "Passagers added.", booking });
    }
    catch(e) {

        return res.status(500).json({message: "Server error: ", error: e.message});
    }
});

router.put('/:bookingId/select-seats', verifyToken, async (req, res) => {


    try {
        const { bookingId } = req.params;
        const { selectedSeats } = req.body;

        if (!selectedSeats || !Array.isArray(selectedSeats) || selectedSeats.length === 0) {
            return res.status(400).json({ message: "Please select at least one seat." });
        }

        const booking = await BookedFlight.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Reservation not found." });
        }

        if (booking.user_id.toString() !== req.user.user_id) {
            return res.status(403).json({ message: "You are not allowed to do this." });
        }

        if (booking.seats && booking.seats.length > 0) {
            return res.status(400).json({ message: "Seats already selected." });
        }

        if (selectedSeats.length !== booking.number_of_seats) {
            return res.status(400).json({ message: `Please select exactly ${booking.number_of_seats} seats.` });
        }

        const flight = await Flight.findById(booking.flight_id);
        if (!flight) {
            return res.status(404).json({ message: "Flight not found." });
        }


        const seatsToUpdate = [];
        for (const seatNumber of selectedSeats) {
            const seatInFlight = flight.seats.find(s => s.seatNumber === seatNumber);

            if (!seatInFlight) {
                return res.status(400).json({ message: `Seat ${seatNumber} doesn't exist.` });
            }
            if (seatInFlight.status === 'occupied') { 
                return res.status(400).json({ message: `Seat ${seatNumber} already reserved.` });
            }

            seatsToUpdate.push(seatInFlight);
        }


        seatsToUpdate.forEach(seat => {
            seat.status = 'occupied';
            seat.bookedBy = booking.user_id;
            seat.bookingType = booking.booking_type; 
        });


        booking.seats = selectedSeats; 

        await flight.save();
        await booking.save();


        const io = req.app.get("io");
        selectedSeats.forEach(seatNumber => {
             io.emit("seatReserved", {
                 flightId: flight._id,
                 seatNumber: seatNumber
             });
         });

        return res.status(200).json({ message: "Seats reserved.", booking });

    } catch (e) {

        return res.status(500).json({ message: "Server error: ", error: e.message });
    }
});

router.get("/:id", verifyUser, async (req, res) => {
    try {
        const userId = req.params.id;
        const reservationId = req.query.r_id; 

        const query = {};
        query.user_id = userId;

        if(reservationId != null) query._id = reservationId;

        const bookings = await BookedFlight.find(query)
            .populate("flight_id")
            .populate({
                path: "flight_id",
                populate: { path: "charter_provider_id" }
            });

        return res.status(200).json(bookings);
    } catch (e) {

        return res.status(500).json({ message: "Server error." });
    }
});

router.get("/", verifyAdmin, async(req, res) => {

    try {

        const reservations = await BookedFlight.find();

        return res.status(200).json(reservations);
    }
    catch(e) {

        return res.status(500).json({message: "Server error."});
    }
});

router.get('/all/:flightId', verifyCharter, async(req, res) => {

    try {

        const reservations = await BookedFlight.find({flight_id: req.params.flightId})
        .populate("user_id");

        return res.status(200).json(reservations);
    }
    catch(e) {

        return res.status(500).json({message: "Server error"});
    }
});

router.delete('/:bookingId', verifyToken, async(req, res) => {
    try {
        const { bookingId } = req.params;

        const reservation = await BookedFlight.findById(bookingId);

        if(!reservation) {
            return res.status(404).json({message: "Booking not found"});
        }

        if(reservation.user_id.toString() !== req.user.user_id && req.user.role !== "admin") {
            return res.status(403).json({message: "You are not allowed to do this"});
        }


        let flight = await Flight.findById(reservation.flight_id);
        if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
        }


        const seatsToRelease = reservation.seats; 
        for (const seatNumber of seatsToRelease) {
            const seatInFlight = flight.seats.find(s => s.seatNumber === seatNumber);
            if (seatInFlight && seatInFlight.status === 'occupied') { 
                seatInFlight.status = 'available';
                seatInFlight.bookedBy = null;
                seatInFlight.bookingType = null;
            }
        }


        if (reservation.booking_type === 'public') {
            flight.public_seats += reservation.number_of_seats;
        } else if (reservation.booking_type === 'charter') {
            flight.charter_seats += reservation.number_of_seats;
        }


        if (reservation.booking_type === 'charter' && reservation.package_code_id) {
            const packageCode = await PackageCode.findById(reservation.package_code_id);
            if (packageCode) {
                packageCode.isUsed = false;
                packageCode.usedAt = null;
                packageCode.usedByBooking = null;
                await packageCode.save();
            }
        }


        await flight.save();


        await BookedFlight.findByIdAndDelete(bookingId);

         const io = req.app.get("io");
         seatsToRelease.forEach(seatNumber => {
             io.emit("seatCanceled", {
                 flightId: flight._id,
                 seatNumber: seatNumber
             });
         });

        return res.status(200).json({message: "Reservation canceled."});
    }
    catch(e) {

        return res.status(500).json({message: "Server error: ", error: e.message});
    }
});

router.get('/:id/pdf', async (req, res) => {
  try {
    const reservation = await BookedFlight.findById(req.params.id).populate('flight_id');
    if (!reservation || !reservation.seats || !reservation.passagers) {
      return res.status(400).send('Incomplete reservation data.');
    }

    let flight = reservation.flight_id;
    console.log(flight);

    const doc = new PDFDocument({ size: 'A4', margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=tickets.pdf');
    doc.pipe(res);

    for (let i = 0; i < reservation.passagers.length; i++) {
      const passenger = reservation.passagers[i];
      const seat = reservation.seats[i];

      if (i > 0) doc.addPage();

      const qrData = `Name: ${passenger.name}\nSeat: ${seat}\nFlight: ${flight.flightNumber}`;
      const qrImage = await QRCode.toDataURL(qrData);

      doc
        .fontSize(20).text('Flight Ticket for ' + flight.flightNumber, { align: 'center' })
        .moveDown()
        .fontSize(12)
        .text(`Name: ${passenger.name}`)
        .text(`Seat: ${seat}`)
        .text(`Personal ID: ${passenger.personal_id}`)
        .text(`Gender: ${passenger.gender}`)
        .text(`Baggage: ${passenger.baggage} (+€${passenger.additional_price})`)
        .text(`Flight Date: ${new Date(flight.departure_date).toLocaleDateString("RO")}`)
        .text(`Departure Time: ${flight.departure_time}`)
        .text(`From: ${flight.source_city}`)
        .text(`To: ${flight.destination_city}`)
        .moveDown();

      doc.image(qrImage, { width: 100, align: 'right' });
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to generate PDF.');
  }
});


export default router;