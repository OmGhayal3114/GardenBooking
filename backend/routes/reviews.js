// Routes: /api/reviews
const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/auth');
const db       = require('../config/db');

// GET /api/reviews/:venueId
router.get('/:venueId', async (req, res) => {
    try {
        const [reviews] = await db.execute(`
            SELECT r.*, u.full_name FROM reviews r
            JOIN users u ON r.user_id = u.user_id
            WHERE r.venue_id = ? ORDER BY r.created_at DESC`, [req.params.venueId]);
        res.json({ success: true, data: reviews });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load reviews.' });
    }
});

// POST /api/reviews
router.post('/', protect, async (req, res) => {
    try {
        const { venue_id, rating, review_text } = req.body;
        if (!venue_id || !rating)
            return res.status(400).json({ success: false, message: 'venue_id and rating required.' });
        if (rating < 1 || rating > 5)
            return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });

        await db.execute(
            'INSERT INTO reviews (user_id, venue_id, rating, review_text) VALUES (?, ?, ?, ?)',
            [req.user.id, venue_id, rating, review_text || '']
        );

        // Update venue average rating
        await db.execute(
            'UPDATE venues SET rating = (SELECT AVG(rating) FROM reviews WHERE venue_id = ?) WHERE venue_id = ?',
            [venue_id, venue_id]
        );

        res.status(201).json({ success: true, message: 'Review submitted!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to submit review.' });
    }
});

module.exports = router;
