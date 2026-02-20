import * as pdfjsLib from 'pdfjs-dist';
// Robust worker configuration with fallback versioning
const PDFJS_VERSION = pdfjsLib.version || '4.0.379';
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;
export async function loadPDF(data: ArrayBuffer | File) {
  try {
    const source = data instanceof File ? await data.arrayBuffer() : data;
    const loadingTask = pdfjsLib.getDocument({ 
      data: source,
      // Increase verbosity for easier debugging in dev environments
      verbosity: pdfjsLib.VerbosityLevel.ERRORS 
    });
    return await loadingTask.promise;
  } catch (error: any) {
    console.error('PDF Load Error Details:', error);
    // Distinguish between network (worker) errors and file corruption
    if (error.message?.includes('worker')) {
      throw new Error('NETWORK_ERROR: Could not load processing engine. Check your connection.');
    }
    throw new Error('CORRUPTION_ERROR: Document is encrypted or not a valid PDF.');
  }
}