import Tesseract from 'tesseract.js';

export async function extractTextFromFile(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
        return extractTextFromPdf(file);
    } else if (file.type.startsWith('image/')) {
        return extractTextFromImage(file);
    } else {
        throw new Error('Unsupported file type');
    }
}

async function extractTextFromImage(file: File): Promise<string> {
    const result = await Tesseract.recognize(file, 'eng');
    return result.data.text;
}

async function extractTextFromPdf(file: File): Promise<string> {
    // Dynamically import PDF.js to avoid SSR issues with DOMMatrix/Canvas
    const pdfjsLib = await import('pdfjs-dist');

    // Set worker path
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

    const arrayBuffer = await file.arrayBuffer();
    // @ts-ignore
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
    }

    return fullText;
}
