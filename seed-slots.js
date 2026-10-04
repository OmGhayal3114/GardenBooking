// seed-slots.js — Seeds time_slots for the next 14 days in TiDB
require('dotenv').config();
const db = require('./backend/config/db');

async function seedSlots() {
    console.log('🌱 Seeding time slots for next 14 days...');

    // Slots per sport (start_time, end_time)
    const slotTimes = [
        ['06:00:00','07:00:00'], ['07:00:00','08:00:00'],
        ['08:00:00','09:00:00'], ['09:00:00','10:00:00'],
        ['10:00:00','11:00:00'], ['17:00:00','18:00:00'],
        ['18:00:00','19:00:00'], ['19:00:00','20:00:00'],
        ['20:00:00','21:00:00'],
    ];

    // Venue-sport combinations from venue_sports table
    const [venueSports] = await db.execute(
        'SELECT vs.venue_id, vs.sport_id FROM venue_sports vs JOIN venues v ON vs.venue_id = v.venue_id WHERE v.status = \'active\''
    );

    const today = new Date();
    let inserted = 0;
    let skipped  = 0;

    for (let dayOffset = 1; dayOffset <= 14; dayOffset++) {
        const date = new Date(today);
        date.setDate(today.getDate() + dayOffset);
        const dateStr = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'

        for (const { venue_id, sport_id } of venueSports) {
            for (const [start, end] of slotTimes) {
                try {
                    const [r] = await db.execute(
                        `INSERT IGNORE INTO time_slots 
                         (venue_id, sport_id, slot_date, start_time, end_time, capacity, available_capacity, status)
                         VALUES (?, ?, ?, ?, ?, 1, 1, 'AVAILABLE')`,
                        [venue_id, sport_id, dateStr, start, end]
                    );
                    if (r.affectedRows > 0) inserted++;
                    else skipped++;
                } catch (e) {
                    console.error(`  Error: venue ${venue_id} sport ${sport_id} ${dateStr} ${start}:`, e.message);
                }
            }
        }
    }

    console.log(`✅ Done — ${inserted} slots inserted, ${skipped} already existed.`);
    process.exit(0);
}

seedSlots().catch(e => { console.error(e); process.exit(1); });
