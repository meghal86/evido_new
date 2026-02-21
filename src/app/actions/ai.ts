'use server';

export async function analyzeDocumentText(text: string) {
    // In a real app, call OpenAI API here
    // const completion = await openai.chat.completions.create({...})

    // Mock response based on keywords
    const lowerText = text.toLowerCase();

    let suggestedCriterion = 'original'; // Default
    let confidence = 0.5;

    if (lowerText.includes('award') || lowerText.includes('prize') || lowerText.includes('won')) {
        suggestedCriterion = 'awards';
        confidence = 0.8;
    } else if (lowerText.includes('member') || lowerText.includes('fellow') || lowerText.includes('senior')) {
        suggestedCriterion = 'membership';
        confidence = 0.8;
    } else if (lowerText.includes('judge') || lowerText.includes('review') || lowerText.includes('committee')) {
        suggestedCriterion = 'judging';
        confidence = 0.9;
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
        criterionId: suggestedCriterion,
        title: "Extracted Evidence Item", // detailed title would come from LLM
        description: `Auto-extracted from document. Contains keywords matching ${suggestedCriterion}.`,
        metrics: {
            confidence_score: confidence,
            keywords_found: 5
        },
        sourceDate: new Date(),
        extractedText: text.substring(0, 200) + '...'
    };
}
