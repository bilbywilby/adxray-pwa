import { useExtractionStore } from '@/lib/extraction-store';
import { useHistoryStore } from '@/lib/history-store';
import { loadPDF } from '@/services/pdf/pdfLoader';
import { extractDocumentText } from '@/services/pdf/textExtractor';
import { analyzeLayout } from '@/services/pdf/layoutAnalyzer';
export function usePDFExtraction() {
  const setStatus = useExtractionStore(s => s.setStatus);
  const setFile = useExtractionStore(s => s.setFile);
  const setResults = useExtractionStore(s => s.setResults);
  const setError = useExtractionStore(s => s.setError);
  const addRecord = useHistoryStore(s => s.addRecord);
  const processFile = async (file: File) => {
    try {
      setFile(file.name);
      setStatus('loading');
      const pdf = await loadPDF(file);
      setStatus('processing');
      const textItems = await extractDocumentText(pdf);
      const layoutText = analyzeLayout(textItems);
      if (!layoutText || layoutText.trim().length === 0) {
        throw new Error('DOCUMENT_EMPTY: No readable text detected in the provided PDF.');
      }
      setStatus('parsing');
      const response = await fetch('/api/extract-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: layoutText })
      });
      const res = await response.json();
      if (!res.success) throw new Error(res.error || 'AI_EXTRACTION_FAILURE: Matrix mapping failed.');
      // Save to results and persistence
      setResults(layoutText, res.data);
      addRecord({
        fileName: file.name,
        fileSize: file.size,
        rawText: layoutText,
        structuredData: res.data
      });
    } catch (err: any) {
      console.error('Pipeline Error:', err);
      const message = err.message || 'FATAL_SYSTEM_ERROR: Pipeline breached.';
      setError(message);
    }
  };
  return { processFile };
}