// ============================================================
//  KHELOINDIA — MySQL Connection Pool
//  Supports both local MySQL and TiDB Cloud (SSL)
// ============================================================
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs    = require('fs');
const path  = require('path');

const isCloud = process.env.DB_HOST && process.env.DB_HOST !== 'localhost';

// Build SSL config — required for TiDB Cloud
let sslConfig = false;
if (isCloud) {
    sslConfig = { minVersion: 'TLSv1.2', rejectUnauthorized: true };
}

const pool = mysql.createPool({
    host:               process.env.DB_HOST     || 'localhost',
    port:   parseInt(  process.env.DB_PORT      || 3306),
    user:               process.env.DB_USER     || 'root',
    password:           process.env.DB_PASSWORD || '',
    database:           process.env.DB_NAME     || 'kheloindia',
    ssl:                sslConfig,
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    charset:            'utf8mb4'
});

// Test connection on startup (non-fatal — frontend still works without MySQL)
pool.getConnection()
    .then(conn => {
        console.log('✅ MySQL/TiDB connected successfully');
        conn.release();
    })
    .catch(err => {
        console.warn('⚠️  DB not connected:', err.message);
        console.warn('   Frontend demo mode is still available.');
        console.warn('   To enable the full API, check your .env credentials.');
    });

module.exports = pool;
