import express from 'express';
import Flight from '../models/Flight.js';
import PackageCode from '../models/PackageCode.js';
import { v4 as uuidv4 } from 'uuid'; 
import verifyCharter from '../middlewares/charterMiddleware.js';
import verifyToken from '../middlewares/authMiddlewares.js';

const router = express.Router();

router.get('/:flightId', verifyCharter, async(req, res) => {

    const {flightId} = req.params;

    try {

        const codes = await PackageCode.find({flightId});

        return res.status(200).json(codes);
    }
    catch(e) {

        return res.status(500).json({message: "Server error"});
    }
});

router.get('/promotion/:id', verifyToken, async(req, res) => {

    try {

        const code = await PackageCode.findById(req.params.id)
                        .populate("flightId");


        return res.status(200).json(code);
    }
    catch(e) {

        return res.status(500).json("Server error.");
    }
});

router.get('/pro/:code', verifyToken, async(req, res) => {

    try {

        const code = await PackageCode.find({code: req.params.code})
                        .populate("flightId");


        return res.status(200).json(code);
    }
    catch(e) {

        return res.status(500).json("Server error.");
    }
});

router.post('/:flightId/generate-package-codes', verifyCharter, async (req, res) => {

    const { flightId } = req.params;
    const { numberOfCodesToGenerate, seatsPerCode } = req.body;

    if (!numberOfCodesToGenerate || !seatsPerCode || numberOfCodesToGenerate <= 0 || seatsPerCode <= 0) {
        return res.status(400).json({ message: "Number of seats and codes need to be positive." });
    }

    try {
        const flight = await Flight.findById(flightId);
        if (!flight) {
            return res.status(404).json({ message: "Flight not found." });
        }

        const generatedCodes = [];
        for (let i = 0; i < numberOfCodesToGenerate; i++) {
            let uniqueCode;
            let isUnique = false;
            let attempts = 0;
            const MAX_ATTEMPTS = 5;

            while (!isUnique && attempts < MAX_ATTEMPTS) {

                uniqueCode = uuidv4().replace(/-/g, '').substring(0, 10).toUpperCase();
                const existingCode = await PackageCode.findOne({ code: uniqueCode });
                if (!existingCode) {
                    isUnique = true;
                }
                attempts++;
            }

            if (!isUnique) {
                return res.status(500).json({ message: "Can't provide a unique code. Please try again." });
            }

            const newPackageCode = new PackageCode({
                code: uniqueCode,
                flightId: flight._id,
                seatsAllocated: seatsPerCode,
                isUsed: false,
                issuedAt: new Date()
            });
            await newPackageCode.save();
            generatedCodes.push(newPackageCode);
        }

        res.status(201).json({
            message: `${numberOfCodesToGenerate} generated codes for flight ${flight.flightNumber}!`,
            codes: generatedCodes.map(c => ({ code: c.code, seatsAllocated: c.seatsAllocated, id: c._id }))
        });

    } catch (error) {

        res.status(500).json({ message: "Server error: ", error: error.message });
    }
});

export default router;