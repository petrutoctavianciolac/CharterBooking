import Seat from '../models/Seat.js';
import Router from 'express';
import verifyToken from '../middlewares/authMiddlewares.js'

const router = Router();

router.get('/:id', async(req, res) => {

    try {

        const seats = await Seat.find({flight_id: req.params.id});

        return res.status(200).json(seats);
    }
    catch(e) {

        return res.status(500).json({message: "Server error"});
    }
});

export default router;