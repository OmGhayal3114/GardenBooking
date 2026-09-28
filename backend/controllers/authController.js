// ============================================================
//  KHELOINDIA — Auth Controller
//  Register, Login (users + admins)
// ============================================================
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../config/db');

const JWT_SECRET  = process.env.JWT_SECRET || 'kheloindia_secret';
const JWT_EXPIRES = '7d';

/** POST /api/auth/register */
const register = async (req, res) => {
    try {
        const { full_name, email, phone, password } = req.body;
        if (!full_name || !email || !phone || !password)
            return res.status(400).json({ success: false, message: 'All fields are required.' });

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ success: false, message: 'Invalid email format.' });

        // Check existing user
        const [existing] = await db.execute('SELECT user_id FROM users WHERE email = ?', [email]);
        if (existing.length > 0)
            return res.status(409).json({ success: false, message: 'An account with this email already exists.' });

        const hashed = await bcrypt.hash(password, 10);
        const [result] = await db.execute(
            'INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)',
            [full_name, email, phone, hashed]
        );

        const token = jwt.sign(
            { id: result.insertId, email, role: 'user' },
            JWT_SECRET, { expiresIn: JWT_EXPIRES }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            token,
            user: { user_id: result.insertId, full_name, email, phone }
        });
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
    }
};

/** POST /api/auth/login */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Email and password are required.' });

        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0)
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });

        const user = users[0];
        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return res.status(401).json({ success: false, message: 'Invalid email or password.' });

        const token = jwt.sign(
            { id: user.user_id, email: user.email, role: 'user' },
            JWT_SECRET, { expiresIn: JWT_EXPIRES }
        );

        res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: { user_id: user.user_id, full_name: user.full_name, email: user.email, phone: user.phone }
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
    }
};

/** POST /api/auth/admin/login */
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [admins] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
        if (admins.length === 0)
            return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });

        const admin = admins[0];
        const valid = await bcrypt.compare(password, admin.password);
        if (!valid)
            return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });

        const token = jwt.sign(
            { id: admin.admin_id, email: admin.email, role: 'admin' },
            JWT_SECRET, { expiresIn: JWT_EXPIRES }
        );

        res.json({ success: true, token, admin: { admin_id: admin.admin_id, name: admin.name, email: admin.email } });
    } catch (err) {
        console.error('Admin login error:', err.message);
        res.status(500).json({ success: false, message: 'Login failed.' });
    }
};

module.exports = { register, login, adminLogin };
