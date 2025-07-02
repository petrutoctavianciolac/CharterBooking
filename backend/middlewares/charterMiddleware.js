import verifyToken from "./authMiddlewares.js";

const verifyCharter = (req, res, next) => {

    verifyToken(req, res, () => {

        if (req.user && req.user.role === "charter" || req.user.role === "admin") {

            next();
        } else {
            
            return res.status(403).json({ error: "You are not allowed to do this." });
        }
    });
};

export default verifyCharter;