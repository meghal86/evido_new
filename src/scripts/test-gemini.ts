
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";

// Load .env.local from project root
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testGemini() {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    console.log("Checking API Key:", apiKey ? `Present (starts with ${apiKey.substring(0, 4)}...)` : "MISSING");

    if (!apiKey) {
        console.error("No API KEY found in process.env!");
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = "Hello, reply with 'Connected!' if you receive this.";
        console.log("Sending prompt to gemini-2.0-flash...");

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log("Response received:", text);
    } catch (error) {
        console.error("Error testing Gemini:", error);
    }
}

testGemini();
