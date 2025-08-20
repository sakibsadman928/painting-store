import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        
        if (!token) {
            return res.json({ success: false, message: "Not authorized" });
        }
        
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.json({
                success: false,
                message: "Session expired. Please login again."
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.json({
                success: false,
                message: "Invalid token. Please login again."
            });
        }
        
        res.json({ success: false, message: "Authentication error" });
    }
};

export default authUser;