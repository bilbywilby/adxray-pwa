export async function resizeImage(base64Str: string, maxWidth = 1024): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `data:image/jpeg;base64,${base64Str}`;
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
      resolve(canvas.toDataURL('image/jpeg', 0.85).split(',')[1]);
    };
    img.onerror = reject;
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
export function getVerdictColor(verdict: 'bad' | 'ok' | 'good') {
  switch (verdict) {
    case 'bad': return 'border-red-500 shadow-red-500/50 text-red-500';
    case 'good': return 'border-lime-accent shadow-lime-accent/50 text-lime-accent';
    default: return 'border-yellow-500 shadow-yellow-500/50 text-yellow-500';
  }
}