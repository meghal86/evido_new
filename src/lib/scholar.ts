import { getJson } from "serpapi";

export async function searchGoogleScholarAuthor(name: string) {
    const apiKey = process.env.SERPAPI_KEY;

    if (!apiKey) {
        console.warn("SERPAPI_KEY is not set. Using mock Google Scholar data for", name);
        // Fallback to mock data if no key is present.
        return createMockScholarData(name);
    }

    try {
        const response = await getJson({
            engine: "google_scholar_profiles",
            mauthors: name,
            api_key: apiKey
        });

        if (!response.profiles || response.profiles.length === 0) {
            return [];
        }

        const topProfile = response.profiles[0];

        // Now fetch their actual articles
        const articlesResponse = await getJson({
            engine: "google_scholar_author",
            author_id: topProfile.author_id,
            api_key: apiKey
        });

        if (!articlesResponse.articles) {
            return [];
        }

        return articlesResponse.articles.map((article: any) => ({
            id: article.title,
            title: article.title,
            year: article.year,
            cited_by: article.cited_by?.value || 0,
            link: article.link || topProfile.link,
            authors: article.authors || ""
        }));

    } catch (error) {
        console.error("Error fetching from SerpApi:", error);
        return [];
    }
}

function createMockScholarData(name: string) {
    return [
        {
            id: "mock1",
            title: "Advanced Machine Learning Techniques in Computer Vision",
            year: "2023",
            cited_by: 145,
            link: "https://scholar.google.com/citations?user=mock",
            authors: `${name}, J. Doe, S. Smith`
        },
        {
            id: "mock2",
            title: "Scalable Distributed Systems for Large Language Models",
            year: "2024",
            cited_by: 89,
            link: "https://scholar.google.com/citations?user=mock",
            authors: `A. Turing, ${name}`
        },
        {
            id: "mock3",
            title: "Optimizing Database Queries with Neural Networks",
            year: "2022",
            cited_by: 210,
            link: "https://scholar.google.com/citations?user=mock",
            authors: `${name}`
        }
    ];
}
