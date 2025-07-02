import verifyAdmin from '../middlewares/adminMiddleware.js';
import Router from 'express';
import CharterProvider from '../models/CharterProvider.js';

const router = Router();

router.get('/', verifyAdmin, async(req, res) => {

    try {

        const charters = await CharterProvider.find();

        return res.status(200).json(charters);
    }
    catch(e) {

        return res.status(500).json("Server error");
    }
});

export default router;