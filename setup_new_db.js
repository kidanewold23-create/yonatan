const { Client } = require('pg');
const fs = require('fs');

async function initNewDatabase() {
    const passwords = ["Pass@123!!!@", "Pass%40123%21%21%21%40"];
    const hosts = [
        "db.yrelqbvkxwdkzaraydfz.supabase.co:5432",
        "aws-0-eu-central-1.pooler.supabase.com:6543"
    ];

    let client = null;
    let connected = false;

    for (const host of hosts) {
        for (const pass of passwords) {
            const userStr = host.includes("pooler") ? "postgres.yrelqbvkxwdkzaraydfz" : "postgres";
            const dbUrl = `postgresql://${userStr}:${encodeURIComponent("Pass@123!!!@")}@${host}/postgres`;
            try {
                console.log(`Connecting to ${host}...`);
                client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
                await client.connect();
                console.log(`Successfully connected to ${host}!`);
                connected = true;
                break;
            } catch (err) {
                console.log(`Failed connection to ${host}: ${err.message}`);
            }
        }
        if (connected) break;
    }

    if (!connected || !client) {
        console.error("Could not connect to database via direct pg connection.");
        return;
    }

    try {
        console.log("Applying schema.sql...");
        const schemaSql = fs.readFileSync('schema.sql', 'utf8');
        await client.query(schemaSql);
        console.log("schema.sql applied successfully!");

        console.log("Applying schema_quiz.sql...");
        const quizSql = fs.readFileSync('schema_quiz.sql', 'utf8');
        await client.query(quizSql);
        console.log("schema_quiz.sql applied successfully!");
    } catch (e) {
        console.error("Error running database setup:", e.message);
    } finally {
        await client.end();
    }
}

initNewDatabase();
