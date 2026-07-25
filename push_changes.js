const { MESSAGES } = require('./api/messages');

const SUPABASE_URL = "https://yrelqbvkxwdkzaraydfz.supabase.co";
const SUPABASE_KEY = "sb_publishable_ZIfc-LO2UBt8CPVdY-WUgQ_U_WGF8T3";

const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
};

async function seedTranslations() {
    console.log("Seeding languages via REST API to new Supabase project...");
    const languages = [
        { code: "en", name: "English", is_active: true },
        { code: "am", name: "አማርኛ", is_active: true },
        { code: "om", name: "Afaan Oromoo", is_active: true },
        { code: "ti", name: "ትግርኛ", is_active: true }
    ];

    const langRes = await fetch(`${SUPABASE_URL}/rest/v1/languages`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(languages)
    });
    if (!langRes.ok) {
        console.error("Error inserting languages:", await langRes.text());
    } else {
        console.log("Seeded all 4 languages (en, am, om, ti) successfully!");
    }

    console.log("Seeding translations via REST API...");
    const rows = [];
    for (const [langCode, keys] of Object.entries(MESSAGES)) {
        for (const [key, value] of Object.entries(keys)) {
            rows.push({ lang_code: langCode, key: key, value: value });
        }
    }

    const transRes = await fetch(`${SUPABASE_URL}/rest/v1/translations`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(rows)
    });
    if (!transRes.ok) {
        console.error("Error inserting translations:", await transRes.text());
    } else {
        console.log(`Successfully seeded ${rows.length} translations across all 4 languages!`);
    }
}

seedTranslations();
