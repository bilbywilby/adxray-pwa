import { useExtractionStore } from '@/lib/extraction-store';
import { loadPDF } from '@/services/pdf/pdfLoader';
import { extractDocumentText } from '@/services/pdf/textExtractor';
import { analyzeLayout } from '@/services/pdf/layoutAnalyzer';
export function usePDFExtraction() {
  const setStatus = useExtractionStore(s => s.setStatus);
  const setFile = useExtractionStore(s => s.setFile);
  const setResults = useExtractionStore(s => s.setResults);
  const setError = useExtractionStore(s => s.setError);
  const processFile = async (file: File) => {
    try {
      setFile(file.name);
      setStatus('loading');
      const pdf = await loadPDF(file);
      setStatus('processing');
      const textItems = await extractDocumentText(pdf);
      const layoutText = analyzeLayout(textItems);
      setStatus('parsing');
      const response = await fetch('/api/extract-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: layoutText })
      });
      const res = await response.json();
      if (!res.success) throw new Error(res.error || 'Extraction failed');
      setResults(layoutText, res.data);
    } catch (err: any) {
      console.error('Pipeline Error:', err);
      setError(err.message || 'Fatal error in document pipeline');
    }
  };
  return { processFile };
}