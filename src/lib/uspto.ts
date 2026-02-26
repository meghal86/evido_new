export async function searchUSPTO(name: string) {
    // The PatentsView API allows querying by inventor name
    // Documentation: https://patentsview.org/apis/api-endpoints/patents
    try {
        // Query to match inventor's first or last name
        const query = {
            _or: [
                { _text_any: { "inventor_name_first": name } },
                { _text_any: { "inventor_name_last": name } },
                { _text_any: { "assignee_organization": name } }
            ]
        };

        const url = `https://api.patentsview.org/patents/query?q=${encodeURIComponent(JSON.stringify(query))}&f=["patent_number","patent_title","patent_date","inventor_name_first","inventor_name_last","assignee_organization"]`;

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            console.error("USPTO API Error:", response.statusText);
            return [];
        }

        const data = await response.json();

        if (!data || !data.patents || data.patents.length === 0) {
            return [];
        }

        return data.patents.map((patent: any) => {
            const inventors = patent.inventors?.map((i: any) => `${i.inventor_name_first} ${i.inventor_name_last}`).join(', ') || 'Unknown';
            const assignees = patent.assignees?.map((a: any) => a.assignee_organization).filter(Boolean).join(', ') || 'None';

            return {
                id: patent.patent_number,
                number: patent.patent_number,
                title: patent.patent_title,
                date: patent.patent_date,
                inventors: inventors,
                assignees: assignees,
                url: `https://patents.google.com/patent/US${patent.patent_number}`
            }
        });

    } catch (error) {
        console.error("Error fetching from USPTO:", error);
        return [];
    }
}
