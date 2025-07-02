import CharterProvider from '../models/CharterProvider.js';
import User from '../models/User.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/charter-register', async (req, res) => {

    try {
        const { name, email, password } = req.body;
        const existing = await CharterProvider.findOne({ email });
        if (existing) return res.status(409).json({ error: "Email already registered." });

        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(password, salt);

        const newProvider = new CharterProvider({ name, email, hash_password });
        await newProvider.save();

        res.status(201).json({ message: "Charter provider created successfully!" });
    } catch (e) {
        return res.status(500).json(e);
    }
});

router.post('/charter-login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const charterProvider = await CharterProvider.findOne({ email });
        if (!charterProvider) return res.status(400).json({ error: "Invalid email or password." });

        const isMatch = await bcrypt.compare(password, charterProvider.hash_password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email or password." });

        const token = jwt.sign(
            { charter_provider_id: charterProvider._id, role: 'charter', name: charterProvider.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("provider_access_token", token, {
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            path: '/'
        }).status(200).json({ token, charter_provider_id: charterProvider._id, role: 'charter' });
    } catch (e) {
        res.status(500).json({ error: "Server error." });
    }
});


router.post('/login', async(req, res) => {

    try {


        const {email, password} = req.body;
        const user = await User.findOne({email});

        if(!user) return res.status(400).json({ error: "Invalid email or password."});

        const isMatch = await bcrypt.compare(password, user.hash_password);

        if(!isMatch) return res.status(400).json({error: "Invalid email or password."});

        const rolee = user.isAdmin ? "admin" : "user";

        const token = jwt.sign({ user_id: user._id, role: rolee}, process.env.JWT_SECRET, { expiresIn: "7d"});

        res.cookie("access_token", token,{
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            path: '/'
        }).status(200).json({token, user_id: user._id, role: rolee});
    }
    catch(e) {

        res.status(500).json( {error: "Server error."} );
    }
});

router.post('/adminlogin', async(req, res) => {

    try {


        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user.isAdmin) {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        if(!user) return res.status(400).json({ error: "Invalid email or password."});

        const isMatch = await bcrypt.compare(password, user.hash_password);

        if(!isMatch) return res.status(400).json({error: "Invalid email or password."});

        const rolee = user.isAdmin ? "admin" : "user";

        const token = jwt.sign({ user_id: user._id, role: rolee}, process.env.JWT_SECRET, { expiresIn: "7d"});

        res.cookie("access_token", token,{
            httpOnly: true,
            secure: false,
            sameSite: 'Strict',
            path: '/'
        }).status(200).json({token, user_id: user._id, role: rolee});
    }
    catch(e) {

        res.status(500).json( {error: "Server error."} );
    }
});

router.post('/register', async (req, res) => {


    try {
        const {firstName, lastName, email, password, isAdmin} = req.body;

        const existingUser = await User.findOne( {email} );

        if(existingUser) return res.status(409).json( { error: "Email already registed."} );

        const salt = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(password, salt);

        const newUser = new User({firstName, lastName, email, hash_password, isAdmin});
        await newUser.save();

        res.status(201).json({ message: "User created successfuly!"});

    } catch (e) {
        return res.status(500).json(e);
    }
});

router.get('/verify', (req, res) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ error: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ user: decoded });
    } catch (e) {
        return res.status(401).json({ error: "Invalid token" });
    } 
});

router.post('/logout', (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        path: "/"
    });
    return res.status(200).json({ message: "Logged out" });
});

router.get('/charter-verify', (req, res) => {

    const token = req.cookies.provider_access_token; 
    if (!token) return res.status(401).json({ error: "No provider token found" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        
        if (decoded.role !== 'charter') { 
            return res.status(403).json({ error: "Access denied. Not a provider." });
        }
        return res.status(200).json({ provider: decoded }); 
    } catch (e) {
        return res.status(401).json({ error: "Invalid provider token" });
    } 
});

router.post('/charter-logout', (req, res) => {
    res.clearCookie("provider_access_token", { 
        httpOnly: true,
        secure: false,
        sameSite: 'Strict',
        path: "/"
    });
    return res.status(200).json({ message: "Charter Provider logged out" });
});

export default router;