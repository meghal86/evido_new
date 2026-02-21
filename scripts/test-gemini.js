const https = require('https');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error("No API KEY found");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

console.log(`Querying: https://generativelanguage.googleapis.com/v1beta/models?key=***`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log(`Status Code: ${res.statusCode}`);
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", JSON.stringify(json.error, null, 2));
            } else {
                console.log("Available Models:");
                if (json.models) {
                    json.models.forEach(m => console.log(`- ${m.name} (${m.supportedGenerationMethods})`));
                } else {
                    console.log("No models returned. Full response:", data);
                }
            }
        } catch (e) {
            console.error("Failed to parse response:", data);
        }
    });
}).on('error', (err) => {
    console.error("Request failed:", err.message);
});
