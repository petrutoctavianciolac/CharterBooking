import verifyCharter from '../middlewares/charterMiddleware.js';
import Router from 'express';
import AircraftType from '../models/AircraftType.js';

const router = Router();

router.get('/', verifyCharter, async(req, res) => {

    try {

        const aircrafts = await AircraftType.find();

        return res.status(200).json(aircrafts);
    }
    catch(e) {

        return res.status(500).json("Server error");
    }
});

router.get('/:id', async(req, res) => {

    try {

        const aircrafts = await AircraftType.findById(req.params.id);

        return res.status(200).json(aircrafts);
    }
    catch(e) {

        return res.status(500).json("Server error");
    }
});

export default router;