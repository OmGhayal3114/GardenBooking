// ============================================================
//  KHELOINDIA — Venue Controller
// ============================================================
const db = require('../config/db');

/** GET /api/venues — list all venues with optional filters */
const getVenues = async (req, res) => {
    try {
        const { sport, area, min_price, max_price, min_rating, availability } = req.query;

        let sql = `
            SELECT DISTINCT v.*,
                GROUP_CONCAT(DISTINCT s.sport_name ORDER BY s.sport_name SEPARATOR ', ') AS sports_offered
            FROM venues v
            LEFT JOIN venue_sports vs ON v.venue_id = vs.venue_id
            LEFT JOIN sports s ON vs.sport_id = s.sport_id
            WHERE v.status = 'active'
        `;
        const params = [];

        if (sport) {
            sql += ' AND s.sport_name = ?';
            params.push(sport);
        }
        if (area) {
            sql += ' AND v.area = ?';
            params.push(area);
        }
        if (min_price) {
            sql += ' AND v.price_per_hour >= ?';
            params.push(Number(min_price));
        }
        if (max_price) {
            sql += ' AND v.price_per_hour <= ?';
            params.push(Number(max_price));
        }
        if (min_rating) {
            sql += ' AND v.rating >= ?';
            params.push(Number(min_rating));
        }

        sql += ' GROUP BY v.venue_id ORDER BY v.rating DESC';

        const [venues] = await db.execute(sql, params);
        res.json({ success: true, count: venues.length, data: venues });
    } catch (err) {
        console.error('getVenues error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to retrieve venues.' });
    }
};

/** GET /api/venues/:id — single venue details */
const getVenueById = async (req, res) => {
    try {
        const { id } = req.params;
        const [venues] = await db.execute('SELECT * FROM venues WHERE venue_id = ? AND status = "active"', [id]);
        if (venues.length === 0)
            return res.status(404).json({ success: false, message: 'Venue not found.' });

        const venue = venues[0];

        // Get sports
        const [sports] = await db.execute(`
            SELECT s.sport_id, s.sport_name, s.image, vs.available_capacity
            FROM venue_sports vs JOIN sports s ON vs.sport_id = s.sport_id
            WHERE vs.venue_id = ?`, [id]);

        // Get facilities
        const [facilities] = await db.execute(`
            SELECT f.facility_id, f.facility_name
            FROM venue_facilities vf JOIN facilities f ON vf.facility_id = f.facility_id
            WHERE vf.venue_id = ?`, [id]);

        // Get reviews
        const [reviews] = await db.execute(`
            SELECT r.*, u.full_name FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.venue_id = ? ORDER BY r.created_at DESC LIMIT 10`, [id]);

        res.json({ success: true, data: { ...venue, sports, facilities, reviews } });
    } catch (err) {
        console.error('getVenueById error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to retrieve venue details.' });
    }
};

/** GET /api/venues/:id/availability?sport_id=&date= */
const getVenueAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { sport_id, date } = req.query;

        if (!sport_id || !date)
            return res.status(400).json({ success: false, message: 'sport_id and date are required.' });

        const [slots] = await db.execute(`
            SELECT slot_id, start_time, end_time, capacity, available_capacity, status
            FROM time_slots
            WHERE venue_id = ? AND sport_id = ? AND slot_date = ?
            ORDER BY start_time`, [id, sport_id, date]);

        res.json({ success: true, data: slots });
    } catch (err) {
        console.error('getVenueAvailability error:', err.message);
        res.status(500).json({ success: false, message: 'Failed to retrieve availability.' });
    }
};

module.exports = { getVenues, getVenueById, getVenueAvailability };
