// Fix admin password + demo user passwords in TiDB Cloud
const mysql = require('mysql2/promise');

async function fix() {
    const pool = await mysql.createPool({
        host:     'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
        port:     4000,
        user:     '2mZq6kJ7LN1zYpu.root',
        password: 'YpKJ9Nf2ql75XWoD',
        database: 'kheloindia',
        ssl:      { minVersion: 'TLSv1.2', rejectUnauthorized: true }
    });

    // Real bcrypt hash for "admin123"
    const adminHash = '$2a$10$/d2EZAC5ARgkhouuZgDrKe/.iqGSwVH8JKppYkAfuDfdwUuoy5wpC';
    // Real bcrypt hash for "demo123"
    const userHash  = '$2a$10$is3IfvAZb7wbIDyudBGwy.agF9i7F8xxWy7M8othwEXYkBwXPRC8q';

    try {
        // Fix admin password
        await pool.query(`UPDATE admins SET password = ? WHERE email = 'admin@kheloindia.com'`, [adminHash]);
        console.log('✅ Admin password fixed');

        // Fix all demo user passwords (they all use demo123)
        await pool.query(`UPDATE users SET password = ?`, [userHash]);
        console.log('✅ All demo user passwords fixed');

        // Verify
        const [admins] = await pool.query('SELECT admin_id, name, email FROM admins');
        const [users]  = await pool.query('SELECT user_id, full_name, email FROM users');
        console.log('\n👮 Admins:', admins);
        console.log('👥 Users:', users);
        console.log('\n✅ All done! Login with:');
        console.log('   User:  arjun@demo.com / demo123');
        console.log('   Admin: admin@kheloindia.com / admin123');
    } catch(e) {
        console.error('❌', e.message);
    } finally {
        await pool.end();
    }
}
fix();
