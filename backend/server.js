// ============================================================
//  KHELOINDIA — Express Server Entry Point
// ============================================================
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Serve frontend static files ──────────────────────────────
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API Routes ───────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api/sports',   require('./routes/sports'));
app.use('/api/venues',   require('./routes/venues'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/reviews',  require('./routes/reviews'));
app.use('/api/admin',    require('./routes/admin'));

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', project: 'KHELOINDIA', time: new Date().toISOString() });
});

// ── 404 for unknown API routes ───────────────────────────────
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found.' });
});

// ── Serve index.html for all non-API routes (SPA fallback) ───
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// ── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
});

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 KHELOINDIA server running at http://localhost:${PORT}`);
    console.log(`📊 Admin panel: http://localhost:${PORT}/admin/`);
});
