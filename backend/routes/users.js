import User from '../models/User.js';
import express from 'express';
import bcrypt from 'bcrypt';
import verifyAdmin from '../middlewares/adminMiddleware.js';
import verifyUser from '../middlewares/userMiddleware.js';
import BookedFlight from '../models/BookedFlight.js';
import Flight from '../models/Flight.js';

const router = express.Router();

router.get('/', verifyAdmin, async (req, res) => {

    try {

        const {email, firstName, lastName} = req.query;

        let query = {};

        if(email) query.email = email;
        if(firstName) query.firstName = firstName;
        if(lastName) query.lastName = lastName;

        const users = await User.find(query).select("-hash_password");
        return res.status(200).json(users);
    } catch (e) {
        return res.status(500).json(e);
    }
});

router.get('/:id', verifyUser, async(req, res) => {

    try {

        const user = await User.findOne({_id: req.params.id}).select("-hash_password");

        if(!user) {

            return res.status(404).json({message: "User not found"});
        }

        return res.status(200).json(user);
    } catch(e) {

        return res.status(500).json(e);
    }
})

router.post('/', verifyAdmin, async (req, res) => {

    try {
        const {firstName, lastName, email, password, isAdmin} = req.body;
    
        const existingUser = await User.findOne( {email} );
    
        if(existingUser) return res.status(409).json( { error: "Email already registed"} );

        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(password, salt);

        const newUser = new User({firstName, lastName, email, hash_password, isAdmin});
        await newUser.save();
    
        res.status(201).json({ message: "User created successfuly!"});
    
    } catch (e) {
        return res.status(500).json(e);
    }
});

router.put('/:id', verifyUser, async(req, res) => {

    try {

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
        return res.status(200).json(updatedUser);
    }
    catch(e) {

        return res.status(500).json( {message: "Server error"} );
    }
});

router.delete('/:id', verifyUser, async (req, res) => {

    try {

        const deletedUser = await User.findById(req.params.id);

        if(!deletedUser) {

            return res.status(404).json( {message: "User not found."} );
        }


        const reservations = await BookedFlight.find({ user_id: req.params.id });

        for (let reservation of reservations) {
        const flight = await Flight.findById(reservation.flight_id);
        if (flight && new Date(flight.departure_date) > new Date()) {
            return res.status(400).json({
            message: "You can't delete your account because you have active reservations.",
            });
        }
        }


        res.clearCookie("access_token", {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            path: "/"
        });

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json( {message: "User deleted."} );
    }
    catch(e) {

        res.status(500).json( {message: "Server error."} );
    }
});

router.get('/me', verifyUser, async(req, res) => {

    try {

        if (!req.user || !req.user.user_id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await User.findById(req.user.user_id).select("-hash_password");

        if(!user) return res.status(404).json({error: "User not found."});

        return res.json(user);
    }
    catch(e) {

        return res.status(500).json( {error: "Server error."} );
    }

});


export default router;