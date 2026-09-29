// Migration script — uploads schema + seed data to TiDB Cloud
const mysql = require('mysql2/promise');
const fs    = require('fs');
const path  = require('path');

async function run() {
    console.log('🔗 Connecting to TiDB Cloud...');

    const pool = await mysql.createPool({
        host:     'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
        port:     4000,
        user:     '2mZq6kJ7LN1zYpu.root',
        password: 'YpKJ9Nf2ql75XWoD',
        database: 'sys',
        ssl:      { minVersion: 'TLSv1.2', rejectUnauthorized: true },
        multipleStatements: true
    });

    try {
        // Test connection
        await pool.query('SELECT 1');
        console.log('✅ Connected to TiDB Cloud!');

        // Create database
        console.log('📦 Creating database kheloindia...');
        await pool.query('CREATE DATABASE IF NOT EXISTS kheloindia;');
        await pool.query('USE kheloindia;');
        console.log('✅ Database ready.');

        // Import schema
        console.log('📋 Importing schema.sql...');
        const schema = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
        // Remove comments that might trip up TiDB
        const cleanSchema = schema.replace(/^--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        await pool.query(cleanSchema);
        console.log('✅ Schema imported!');

        // Import seed
        console.log('🌱 Importing seed.sql...');
        const seed = fs.readFileSync(path.join(__dirname, 'database', 'seed.sql'), 'utf8');
        const cleanSeed = seed.replace(/^--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
        await pool.query(cleanSeed);
        console.log('✅ Seed data imported!');

        // Verify
        const [venues]   = await pool.query('SELECT COUNT(*) AS count FROM kheloindia.venues;');
        const [sports]   = await pool.query('SELECT COUNT(*) AS count FROM kheloindia.sports;');
        const [slots]    = await pool.query('SELECT COUNT(*) AS count FROM kheloindia.time_slots;');
        const [bookings] = await pool.query('SELECT COUNT(*) AS count FROM kheloindia.bookings;');

        console.log('\n🎉 Migration Complete!');
        console.log(`   Venues:   ${venues[0].count}`);
        console.log(`   Sports:   ${sports[0].count}`);
        console.log(`   Slots:    ${slots[0].count}`);
        console.log(`   Bookings: ${bookings[0].count}`);
        console.log('\n✅ Your TiDB Cloud database is ready!');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        console.error(err);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

run();
