import * as pdfjsLib from 'pdfjs-dist';
// Use standard CDN for the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
export async function loadPDF(data: ArrayBuffer | File) {
  try {
    const source = data instanceof File ? await data.arrayBuffer() : data;
    const loadingTask = pdfjsLib.getDocument({ data: source });
    return await loadingTask.promise;
  } catch (error) {
    console.error('PDF Load Error:', error);
    throw new Error('Could not load PDF document. It might be corrupted or encrypted.');
  }
}