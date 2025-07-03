import Router from 'express';
import City from '../models/City.js';
import verifyAdmin from '../middlewares/adminMiddleware.js';

const router = Router();

router.get('/', async(req, res) => {

    try {

        const cities = await City.find();

        return res.status(200).json(cities);
    }
    catch(e) {

        return res.status(500).json({message: "Server error."});
    }
});

router.get('/:id', verifyAdmin, async(req, res) => {

    try {

        const city = await City.findById(req.params.id);

        return res.status(200).json(city);
    }
    catch(e) {

        return res.status(500).json({message: "Server error."});
    }
})

router.post('/', verifyAdmin, async(req, res) => {

    try {

        const city = new City(req.body);
        await city.save();

        return res.status(200).json(city);
    }
    catch(e) {

        return res.status(500).json({message: "Server error."});
    }
});

router.put('/:id', verifyAdmin, async(req, res) => {

    try {

        const city_id = req.params.id;

        const city = await City.findByIdAndUpdate(city_id, {$set: req.body}, {new: true});
        return res.status(200).json(city);
    }
    catch(e) {

        return res.status(500).json({message: "Server error."});
    }
});

router.delete('/:id', verifyAdmin, async(req, res) => {

    try {

        const city_id = req.params.id;

        const deletedCity = await City.findByIdAndDelete(city_id);

        if(!deletedCity) {
            return res.status(404).json({message: "City not found."});
        }

        return res.status(200).json({message: "City deleted"});
    }
    catch(e) {

        return res.status(500).json({message: "Server error."});
    }
});

export default router;