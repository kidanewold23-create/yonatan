const { Client } = require('pg');
const fs = require('fs');

async function runSetup() {
    const password = "Pass@123!!!@";
    const projectRef = "yrelqbvkxwdkzaraydfz";
    
    // Connection string variants
    const connStrings = [
        `postgresql://postgres:${encodeURIComponent(password)}@db.${projectRef}.supabase.co:5432/postgres`,
        `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`,
        `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres`,
        `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
        `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
        `postgresql://postgres.${projectRef}:${encodeURIComponent(password)}@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres`
    ];

    let client = null;
    let connected = false;

    for (const connStr of connStrings) {
        try {
            console.log(`Trying database connection...`);
            client = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 5000 });
            await client.connect();
            console.log(`Connected successfully to database!`);
            connected = true;
            break;
        } catch (err) {
            console.log(`Connection attempt failed: ${err.message}`);
        }
    }

    if (!connected || !client) {
        console.error("All direct DB connections failed. Testing REST API connection...");
        return;
    }

    try {
        console.log("Applying schema.sql...");
        const schemaSql = fs.readFileSync('schema.sql', 'utf8');
        await client.query(schemaSql);
        console.log("✅ schema.sql applied successfully!");

        console.log("Applying schema_quiz.sql...");
        const quizSql = fs.readFileSync('schema_quiz.sql', 'utf8');
        await client.query(quizSql);
        console.log("✅ schema_quiz.sql applied successfully!");

        console.log("Applying schema_cron.sql...");
        const cronSql = fs.readFileSync('schema_cron.sql', 'utf8');
        await client.query(cronSql);
        console.log("✅ schema_cron.sql applied successfully!");

    } catch (e) {
        console.error("Error executing database setup:", e.message);
    } finally {
        await client.end();
    }
}

runSetup();
