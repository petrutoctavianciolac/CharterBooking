import verifyToken from "./authMiddlewares.js";

const verifyUser = (req, res, next) => {

    verifyToken(req, res, () => {

        if (req.user.user_id == req.params.id || req.user.role === "admin") {

            next();
        } else {
            
            return res.status(403).json({ error: "You are not allowed to do this." });
        }
    });
};

export default verifyUser;