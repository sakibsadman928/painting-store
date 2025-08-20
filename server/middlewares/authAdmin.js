import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
    try {
        const { admin_token } = req.cookies;
        
        if (!admin_token) {
            return res.status(401).json({
                success: false, 
                message: "Admin access required. Please login.",
                isAuthError: true
            });
        }
        
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Server configuration error"
            });
        }
        
        const decoded = jwt.verify(admin_token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({
                success: false, 
                message: "Admin access required",
                isAuthError: true
            });
        }
        
        req.adminId = decoded.adminId;
        req.adminRole = decoded.role;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Admin session expired. Please login again.",
                isAuthError: true,
                expired: true
            });
        }
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Invalid admin token. Please login again.",
                isAuthError: true
            });
        }
        
        res.status(500).json({
            success: false,
            message: "Authentication error"
        });
    }
};

export default authAdmin;