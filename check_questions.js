const axios = require('axios');
const SUPABASE_URL = "https://pgnxsgysnvrgsbuecesc.supabase.co";
const SUPABASE_KEY = "sb_publishable_i1qSlBg5OBbnLpSHuDN4UA_bH6bWAVQ";

async function checkQuestions() {
    try {
        const url = SUPABASE_URL + '/rest/v1/questions';
        const headers = { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY };
        const response = await axios.get(url, { headers });
        console.log("Total questions:", response.data.length);
        const dayCounts = {};
        response.data.forEach(q => {
            dayCounts[q.day_number] = (dayCounts[q.day_number] || 0) + 1;
        });
        console.log("Questions per day:", dayCounts);
    } catch(e) {
        console.log("Error:", e.response ? e.response.data : e.message);
    }
}

checkQuestions();
