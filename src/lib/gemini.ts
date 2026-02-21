import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Export the model for general use (reports, etc)
// Includes a mock fallback if API key is missing to prevent crashes
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

export const geminiModel = genAI ? genAI.getGenerativeModel({ model: "gemini-pro", safetySettings }) : {
    generateContent: async () => ({
        response: {
            text: () => JSON.stringify({
                analysis: "## AI Analysis Unavailable\n\nPlease configure GOOGLE_API_KEY (or GEMINI_API_KEY) in .env to enable AI features.",
                overallScore: 0
            })
        }
    })
};

export const generateAnalysisPrompt = (evidence: any[]) => {
    return `
    Analyze the following EB-1A evidence items and provide a comprehensive report.
    
    Evidence Items:
    ${JSON.stringify(evidence, null, 2)}
    
    Return a JSON object with:
    {
        "analysis": "Detailed markdown analysis of strengths and weaknesses, grouped by criterion.",
        "overallScore": 85
    }
    `;
};

export const analyzeRFE = async (text: string) => {
    if (!genAI) {
        throw new Error("GOOGLE_API_KEY (or GEMINI_API_KEY) is not set");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });

    const prompt = `
    You are an expert immigration attorney specializing in EB-1A filings.
    Analyze the following RFE (Request for Evidence) text and provide a structured JSON response.

    RFE TEXT:
    ${text.substring(0, 30000)} // Limit context window just in case

    Return ONLY a valid JSON object with this structure:
    {
        "status": "challenging" | "standard" | "easy",
        "summary": "Brief summary of the officer's main points",
        "challenged_criteria": [
            {
                "criterion_id": "awards" | "membership" | "published_material" | "judging" | "original" | "authorship" | "leading" | "salary" | "final_merits",
                "officer_reasoning": "What specifically did the officer say is missing?",
                "suggested_response": "High-level strategy to rebut this point",
                "evidence_needed": ["List of specific documents to gather"]
            }
        ],
        "positive_findings": ["List of criteria that were accepted or not challenged"],
        "tone_analysis": "Brief analysis of the officer's tone (e.g., 'Boilerplate', 'Aggressive', 'Reasonable')"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/```json\n?|\n?```/g, '').trim();
        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse JSON", jsonStr);
            throw new Error("AI returned invalid JSON");
        }
    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        throw new Error("Failed to analyze RFE with AI");
    }
};
