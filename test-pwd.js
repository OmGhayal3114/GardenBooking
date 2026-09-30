const mysql = require('mysql2/promise');

async function testPassword(pwd) {
    try {
        const pool = mysql.createPool({
            host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
            port: 4000,
            user: '2mZq6kJ7LNtzYpu.root',
            password: pwd,
            database: 'test',
            ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true }
        });
        await pool.query("SELECT 1");
        console.log(`✅ SUCCESS! The password is: ${pwd}`);
        process.exit(0);
    } catch (e) {}
}

async function run() {
    const chars = {
        'O': ['O', '0'],
        'I': ['I', 'l', '1'],
    };
    
    // Base: mCOPtBIzPQ8wBq9S
    for (let c1 of chars['O']) {
        for (let c2 of chars['I']) {
            let p = `mC${c1}PtB${c2}zPQ8wBq9S`;
            console.log(`Trying ${p}...`);
            await testPassword(p);
        }
    }
    console.log("None worked.");
    process.exit(1);
}
run();
