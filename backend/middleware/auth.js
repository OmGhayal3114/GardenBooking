// ============================================================
//  KHELOINDIA — Auth Middleware (JWT)
// ============================================================
const jwt = require('jsonwebtoken');

/**
 * Protect routes — verifies JWT token in Authorization header.
 */
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Not authenticated. Please login.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kheloindia_secret');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

/**
 * Admin-only middleware — checks req.user.role === 'admin'
 */
const adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    }
    next();
};

module.exports = { protect, adminOnly };
