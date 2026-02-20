import Tesseract from 'tesseract.js';
export async function resizeImage(file: File, maxWidth = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
export async function extractTextFromImage(imagePath: string, onProgress?: (progress: number) => void): Promise<string> {
  try {
    const { data: { text } } = await Tesseract.recognize(
      imagePath,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing' && onProgress) {
            onProgress(m.progress);
          }
        }
      }
    );
    return text;
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('Failed to extract text from image');
  }
}
export interface AdAnalysis {
  detected: string;
  trap: string;
  verdict: string;
  price_comparison: string;
}
export function parseAnalysisResponse(content: string): AdAnalysis {
  // Try to find JSON block first
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.warn("Failed to parse JSON match, falling back to regex", e);
    }
  }
  // Fallback regex parsing for the 3 sections
  const detected = content.match(/DETECTED:?([\s\S]*?)(?=THE TRAP|VERDICT|$)/i)?.[1]?.trim() || "Analysis failed.";
  const trap = content.match(/THE TRAP:?([\s\S]*?)(?=VERDICT|$)/i)?.[1]?.trim() || "Tactics hidden.";
  const verdict = content.match(/VERDICT:?([\s\S]*)/i)?.[1]?.trim() || "Avoid until certain.";
  return {
    detected,
    trap,
    verdict,
    price_comparison: ""
  };
}