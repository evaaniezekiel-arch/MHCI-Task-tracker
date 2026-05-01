const fs = require('fs');
const path = require('path');

function generateWeeksSeed() {
    let sql = '-- Seed 52 weeks of 2025\n';
    let currentDate = new Date('2025-01-06'); // Week 1 Start (Monday)
    
    for (let i = 1; i <= 52; i++) {
        const start = currentDate.toISOString().split('T')[0];
        const end = new Date(currentDate);
        end.setDate(currentDate.getDate() + 4); // Friday
        const endStr = end.toISOString().split('T')[0];
        
        sql += `INSERT INTO weeks (week_number, start_date, end_date, year) VALUES (${i}, '${start}', '${endStr}', 2025) ON CONFLICT DO NOTHING;\n`;
        
        currentDate.setDate(currentDate.getDate() + 7);
    }
    
    fs.writeFileSync(path.join(__dirname, 'supabase', 'migrations', '20240430000003_seed_weeks.sql'), sql);
    console.log('Seed file generated.');
}

generateWeeksSeed();
