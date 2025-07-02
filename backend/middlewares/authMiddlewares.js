import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token || req.cookies.provider_access_token;

    if (!token) {
        return res.status(403).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        req.user = decoded;

        next(); 
    } catch (err) {
        res.status(401).json({ error: "Invalid token." });
    }
};

export default verifyToken;
