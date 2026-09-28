// ============================================================
//  KHELOINDIA — Booking Controller
//  Uses MySQL TRANSACTION to prevent double-booking
// ============================================================
const db = require('../config/db');

/** POST /api/bookings — create a booking with transaction */
const createBooking = async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { venue_id, sport_id, slot_id, payment_method } = req.body;
        const user_id = req.user.id;

        if (!venue_id || !sport_id || !slot_id)
            return res.status(400).json({ success: false, message: 'venue_id, sport_id and slot_id are required.' });

        await conn.beginTransaction();

        // 1. Lock and fetch slot
        const [slots] = await conn.execute(
            'SELECT * FROM time_slots WHERE slot_id = ? FOR UPDATE',
            [slot_id]
        );

        if (slots.length === 0) {
            await conn.rollback();
            return res.status(404).json({ success: false, message: 'Slot not found.' });
        }

        const slot = slots[0];

        // 2. Validate slot matches venue and sport
        if (slot.venue_id != venue_id || slot.sport_id != sport_id) {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Invalid slot for this venue/sport combination.' });
        }

        // 3. Check slot date is not in the past
        const today = new Date().toISOString().split('T')[0];
        if (slot.slot_date < today) {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Cannot book a slot in the past.' });
        }

        // 4. Check availability
        if (slot.available_capacity <= 0 || slot.status === 'BOOKED' || slot.status === 'UNAVAILABLE') {
            await conn.rollback();
            return res.status(409).json({ success: false, message: 'This slot is no longer available.' });
        }

        // 5. Get venue price
        const [venues] = await conn.execute('SELECT price_per_hour FROM venues WHERE venue_id = ?', [venue_id]);
        const amount = venues[0].price_per_hour;

        // 6. Create booking
        const [bookingResult] = await conn.execute(
            `INSERT INTO bookings (user_id, venue_id, sport_id, slot_id, booking_date, start_time, end_time, amount, booking_status, payment_status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED', 'PAID')`,
            [user_id, venue_id, sport_id, slot_id, slot.slot_date, slot.start_time, slot.end_time, amount]
        );
        const booking_id = bookingResult.insertId;

        // 7. Reduce available capacity
        const newCapacity = slot.available_capacity - 1;
        const newStatus   = newCapacity === 0 ? 'BOOKED' : (newCapacity < slot.capacity ? 'PARTIAL' : 'AVAILABLE');

        await conn.execute(
            'UPDATE time_slots SET available_capacity = ?, status = ? WHERE slot_id = ?',
            [newCapacity, newStatus, slot_id]
        );

        // 8. Create demo payment
        const txnId = `DEMO-KI-${Date.now()}`;
        await conn.execute(
            `INSERT INTO payments (booking_id, amount, payment_method, transaction_id, payment_status)
             VALUES (?, ?, ?, ?, 'DEMO_PAID')`,
            [booking_id, amount, payment_method || 'UPI', txnId]
        );

        await conn.commit();

        // 9. Return confirmation
        const bookingRef = `KI-2026-${String(booking_id).padStart(4, '0')}`;
        res.status(201).json({
            success: true,
            message: 'Booking confirmed!',
            data: {
                booking_id: bookingRef,
                venue_id, sport_id, slot_id,
                booking_date:  slot.slot_date,
                start_time:    slot.start_time,
                end_time:      slot.end_time,
                amount,
                transaction_id: txnId,
                payment_status: 'DEMO_PAID',
                booking_status: 'CONFIRMED'
            }
        });
    } catch (err) {
        await conn.rollback();
        console.error('createBooking error:', err.message);
        res.status(500).json({ success: false, message: 'Booking failed. Please try again.' });
    } finally {
        conn.release();
    }
};

/** GET /api/bookings — get current user's bookings */
const getUserBookings = async (req, res) => {
    try {
        const user_id = req.user.id;
        const [bookings] = await db.execute(`
            SELECT b.*, v.venue_name, v.area, s.sport_name,
                   p.transaction_id, p.payment_method, p.payment_status AS pay_status
            FROM bookings b
            JOIN venues  v ON b.venue_id  = v.venue_id
            JOIN sports  s ON b.sport_id  = s.sport_id
            LEFT JOIN payments p ON b.booking_id = p.booking_id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC`, [user_id]);

        // Format booking IDs
        const formatted = bookings.map(b => ({
            ...b,
            booking_ref: `KI-2026-${String(b.booking_id).padStart(4, '0')}`
        }));

        res.json({ success: true, data: formatted });
    } catch (err) {
        console.error('getUserBookings error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to retrieve bookings.' });
    }
};

/** GET /api/bookings/:id */
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const [rows] = await db.execute(`
            SELECT b.*, v.venue_name, v.address, v.area, s.sport_name,
                   p.transaction_id, p.payment_method
            FROM bookings b
            JOIN venues  v ON b.venue_id = v.venue_id
            JOIN sports  s ON b.sport_id = s.sport_id
            LEFT JOIN payments p ON b.booking_id = p.booking_id
            WHERE b.booking_id = ? AND b.user_id = ?`, [id, user_id]);

        if (rows.length === 0)
            return res.status(404).json({ success: false, message: 'Booking not found.' });

        const b = rows[0];
        res.json({ success: true, data: { ...b, booking_ref: `KI-2026-${String(b.booking_id).padStart(4, '0')}` } });
    } catch (err) {
        console.error('getBookingById error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to retrieve booking.' });
    }
};

/** PUT /api/bookings/:id/cancel */
const cancelBooking = async (req, res) => {
    const conn = await db.getConnection();
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        await conn.beginTransaction();

        const [bookings] = await conn.execute(
            'SELECT * FROM bookings WHERE booking_id = ? AND user_id = ? FOR UPDATE', [id, user_id]
        );
        if (bookings.length === 0) {
            await conn.rollback();
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }

        const booking = bookings[0];
        if (booking.booking_status === 'CANCELLED') {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Booking is already cancelled.' });
        }
        if (booking.booking_status === 'COMPLETED') {
            await conn.rollback();
            return res.status(400).json({ success: false, message: 'Completed bookings cannot be cancelled.' });
        }

        // Cancel booking
        await conn.execute(
            `UPDATE bookings SET booking_status = 'CANCELLED', payment_status = 'REFUNDED' WHERE booking_id = ?`, [id]
        );

        // Restore slot capacity
        await conn.execute(
            `UPDATE time_slots SET available_capacity = available_capacity + 1,
             status = CASE WHEN available_capacity + 1 >= capacity THEN 'AVAILABLE' ELSE 'PARTIAL' END
             WHERE slot_id = ?`, [booking.slot_id]
        );

        // Update payment
        await conn.execute(
            `UPDATE payments SET payment_status = 'DEMO_REFUNDED' WHERE booking_id = ?`, [id]
        );

        await conn.commit();
        res.json({ success: true, message: 'Booking cancelled and refund initiated (demo).' });
    } catch (err) {
        await conn.rollback();
        console.error('cancelBooking error:', err.message);
        res.status(500).json({ success: false, message: 'Cancellation failed.' });
    } finally {
        conn.release();
    }
};

module.exports = { createBooking, getUserBookings, getBookingById, cancelBooking };
