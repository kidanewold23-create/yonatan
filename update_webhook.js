const https = require('https');

const token = '8906068445:AAGc5L08H9a1Lc0oYIDL9o4ZqjJbLVMII4Y';
const webhookUrl = 'https://acnaidlegwkqcjxbdwra.supabase.co/functions/v1/api/bot';

function request(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

async function setWebhook() {
    console.log("Setting Telegram webhook to:", webhookUrl);
    const url = `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(webhookUrl)}&allowed_updates=${encodeURIComponent(JSON.stringify(["message", "callback_query", "chat_member"]))}`;
    const res = await request(url);
    console.log("Webhook Response:", res);
}

setWebhook();
