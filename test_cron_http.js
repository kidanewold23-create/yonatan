const https = require('https');

const url = 'https://yrelqbvkxwdkzaraydfz.supabase.co/functions/v1/api/cron/send_daily_quiz';
const anonKey = 'sb_publishable_ZIfc-LO2UBt8CPVdY-WUgQ_U_WGF8T3';

function triggerCron() {
    console.log("Triggering Quiz Cron Job at:", url);
    const req = https.request(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${anonKey}`
        }
    }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log("Cron Execution Response Status:", res.statusCode);
            console.log("Cron Execution Response Body:", data);
        });
    });

    req.on('error', (err) => {
        console.error("Cron Execution Error:", err.message);
    });

    req.write(JSON.stringify({}));
    req.end();
}

triggerCron();
