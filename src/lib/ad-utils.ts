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
        // Return base64 without the data:image/jpeg;base64, prefix for easier worker handling
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(dataUrl.split(',')[1]);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
export interface AdAnalysis {
  detected: {
    productName: string;
    company: string;
    category: string;
    emoji: string;
    confidence: number;
  };
  whyThisAd: {
    summary: string;
    insights: Array<{ label: string; value: string; sentiment: 'negative' | 'neutral' | 'positive' }>;
    tactics: string[];
  };
  marketComparison: {
    advertised: { name: string; price: string; quality: string; deal: string };
    alternatives: Array<{ name: string; emoji: string; price: string; quality: string; deal: string; reason: string }>;
    verdict: 'bad' | 'ok' | 'good';
    verdictTitle: string;
    verdictText: string;
  };
}
export function parseAnalysisResponse(content: string): AdAnalysis {
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No JSON found in response");
  } catch (e) {
    console.error("Parse Error:", e);
    // Return a structured empty state instead of crashing
    return {
      detected: { productName: "Unknown", company: "Unknown", category: "Unidentified", emoji: "❓", confidence: 0 },
      whyThisAd: { summary: "Analysis failed to parse properly.", insights: [], tactics: [] },
      marketComparison: { 
        advertised: { name: "N/A", price: "N/A", quality: "N/A", deal: "N/A" },
        alternatives: [],
        verdict: 'ok',
        verdictTitle: "UNCERTAIN",
        verdictText: "Try a clearer scan."
      }
    };
  }
}