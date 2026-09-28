// ============================================================
//  KHELOINDIA — Admin Controller
// ============================================================
const db = require('../config/db');

/** GET /api/admin/stats */
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [[{total_users}]]    = await db.execute('SELECT COUNT(*) AS total_users FROM users');
        const [[{total_venues}]]   = await db.execute('SELECT COUNT(*) AS total_venues FROM venues WHERE status="active"');
        const [[{total_sports}]]   = await db.execute('SELECT COUNT(*) AS total_sports FROM sports WHERE status="active"');
        const [[{today_bookings}]] = await db.execute('SELECT COUNT(*) AS today_bookings FROM bookings WHERE booking_date = ? AND booking_status = "CONFIRMED"', [today]);
        const [[{avail_slots}]]    = await db.execute('SELECT COUNT(*) AS avail_slots FROM time_slots WHERE slot_date = ? AND status = "AVAILABLE"', [today]);
        const [[{revenue}]]        = await db.execute('SELECT COALESCE(SUM(amount),0) AS revenue FROM bookings WHERE booking_status != "CANCELLED"');

        res.json({ success: true, data: { total_users, total_venues, total_sports, today_bookings, avail_slots, revenue } });
    } catch (err) {
        console.error('getDashboardStats error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to load stats.' });
    }
};

/** GET /api/admin/bookings */
const getAllBookings = async (req, res) => {
    try {
        const [bookings] = await db.execute(`
            SELECT b.*, u.full_name, u.email, v.venue_name, v.area, s.sport_name,
                   p.transaction_id, p.payment_method, p.payment_status AS pay_status
            FROM bookings b
            JOIN users   u ON b.user_id  = u.user_id
            JOIN venues  v ON b.venue_id  = v.venue_id
            JOIN sports  s ON b.sport_id  = s.sport_id
            LEFT JOIN payments p ON b.booking_id = p.booking_id
            ORDER BY b.created_at DESC LIMIT 200`);

        const formatted = bookings.map(b => ({
            ...b, booking_ref: `KI-2026-${String(b.booking_id).padStart(4, '0')}`
        }));
        res.json({ success: true, data: formatted });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load bookings.' });
    }
};

/** GET /api/admin/users */
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute(
            'SELECT user_id, full_name, email, phone, created_at FROM users ORDER BY created_at DESC'
        );
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load users.' });
    }
};

/** POST /api/admin/venues */
const addVenue = async (req, res) => {
    try {
        const { venue_name, address, area, description, opening_time, closing_time, price_per_hour, image } = req.body;
        if (!venue_name || !address || !area || !price_per_hour)
            return res.status(400).json({ success: false, message: 'venue_name, address, area, price_per_hour required.' });

        const [result] = await db.execute(
            `INSERT INTO venues (venue_name, address, area, description, opening_time, closing_time, price_per_hour, image)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [venue_name, address, area, description||'', opening_time||'06:00:00', closing_time||'22:00:00', price_per_hour, image||'']
        );
        res.status(201).json({ success: true, message: 'Venue added.', venue_id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to add venue.' });
    }
};

/** PUT /api/admin/venues/:id/status */
const updateVenueStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['active','inactive','maintenance'].includes(status))
            return res.status(400).json({ success: false, message: 'Invalid status.' });

        await db.execute('UPDATE venues SET status = ? WHERE venue_id = ?', [status, id]);
        res.json({ success: true, message: 'Venue status updated.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to update venue.' });
    }
};

/** POST /api/admin/slots — create time slots */
const createSlots = async (req, res) => {
    try {
        const { venue_id, sport_id, slot_date, slots } = req.body;
        // slots = [{ start_time, end_time, capacity }]
        if (!venue_id || !sport_id || !slot_date || !slots || !slots.length)
            return res.status(400).json({ success: false, message: 'All fields required.' });

        const values = slots.map(s => [venue_id, sport_id, slot_date, s.start_time, s.end_time, s.capacity, s.capacity]);
        await db.query(
            `INSERT IGNORE INTO time_slots (venue_id, sport_id, slot_date, start_time, end_time, capacity, available_capacity)
             VALUES ?`, [values]
        );
        res.status(201).json({ success: true, message: `${slots.length} slot(s) created.` });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to create slots.' });
    }
};

/** PUT /api/admin/bookings/:id/cancel */
const adminCancelBooking = async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { id } = req.params;
        await conn.beginTransaction();
        const [rows] = await conn.execute('SELECT * FROM bookings WHERE booking_id = ? FOR UPDATE', [id]);
        if (!rows.length) { await conn.rollback(); return res.status(404).json({ success: false, message: 'Booking not found.' }); }
        const b = rows[0];
        await conn.execute(`UPDATE bookings SET booking_status='CANCELLED', payment_status='REFUNDED' WHERE booking_id=?`, [id]);
        await conn.execute(`UPDATE time_slots SET available_capacity=available_capacity+1, status=CASE WHEN available_capacity+1>=capacity THEN 'AVAILABLE' ELSE 'PARTIAL' END WHERE slot_id=?`, [b.slot_id]);
        await conn.execute(`UPDATE payments SET payment_status='DEMO_REFUNDED' WHERE booking_id=?`, [id]);
        await conn.commit();
        res.json({ success: true, message: 'Booking cancelled by admin.' });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ success: false, message: 'Failed to cancel.' });
    } finally { conn.release(); }
};

module.exports = { getDashboardStats, getAllBookings, getAllUsers, addVenue, updateVenueStatus, createSlots, adminCancelBooking };
