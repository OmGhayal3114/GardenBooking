// Routes: /api/sports
const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [sports] = await db.execute('SELECT * FROM sports WHERE status = "active" ORDER BY sport_name');
        res.json({ success: true, data: sports });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to load sports.' });
    }
});

module.exports = router;
