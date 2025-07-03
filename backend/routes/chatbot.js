import axios from 'axios';
import Router from 'express';
import verifyToken from '../middlewares/authMiddlewares.js';
import Flight from '../models/Flight.js';
import City from '../models/City.js';
import BookedFlight from '../models/BookedFlight.js';

const router = Router();
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

router.post('/', verifyToken, async (req, res) => {
  const userMessage = req.body.message;

  if (req.body.user_id !== req.user.user_id) {
    return res.status(403).json({ message: "You are not allowed to do this." });
  }

  try {
    const now = new Date();
    const in50Days = new Date();
    in50Days.setDate(now.getDate() + 50);

    const flights = await Flight.find({
      departure_date: { $gte: now, $lte: in50Days }
    }).lean();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const bookings = await BookedFlight.find({
      user_id: req.user.user_id,
      booked_at: { $gte: sixMonthsAgo }
    }).populate('flight_id').lean();

    const cities = await City.find();

    const citiesSummary = cities.map(c => {
      return `${c.name}, ${c.country}`;
    }).join("; ");

    const flightsSummary = flights.map(f => {
      return `Flight ${f._id} from ${f.source_city} to ${f.destination_city}, departure: ${new Date(f.departure_date).toLocaleDateString()}, price: ${f.price} EUR`;
    }).join("; ");

    const bookingsSummary = bookings.map(b => {
      const flight = b.flight_id;
      if (!flight) return `Booking ${b._id} with no flight info`;
      return `Booking: Type: ${b.booking_type} Flight from ${flight.source_city} to ${flight.destination_city}, departure: ${new Date(flight.departure_date).toLocaleDateString()}, price: ${flight.price} EUR, passengers: ${b.number_of_seats}`;
    }).join("; ");


    const initialPrompt = {
      role: "user",
      parts: [
        {
          text: `Ești un chatbot despre vacanțe, zboruri charter și destinații în Europa. 
                Răspunde doar la aceste subiecte, în română sau engleză, în funcție de limba întrebării. 
                Dacă primești altă întrebare, răspunde politicos că nu este în domeniul tău.
                Rezervarile utilizatorului curent sunt: ${bookingsSummary}.
                Orasele in care furnizorii pot avea zboruri sunt: ${citiesSummary}.`
        }
      ]
    };

    const userPrompt = {
      role: "user",
      parts: [{ text: userMessage }]
    };

    const response = await axios.post(`${GEMINI_API_URL}?key=${process.env.GEMINI_KEY}`, {
      contents: [initialPrompt, userPrompt]
    });

    const reply = response.data.candidates[0]?.content?.parts[0]?.text || "Nu am găsit un răspuns.";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("Gemini error:", error.message);
    res.status(500).json({ message: "Eroare Gemini." });
  }
});


export default router;