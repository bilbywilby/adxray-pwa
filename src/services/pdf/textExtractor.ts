import type { PDFDocumentProxy } from 'pdfjs-dist';
export interface TextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  font: string;
}
export async function extractDocumentText(pdf: PDFDocumentProxy): Promise<TextItem[]> {
  const allItems: TextItem[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const viewport = page.getViewport({ scale: 1.0 });
    const pageItems = content.items.map((item: any) => {
      // transform: [scaleX, skewY, skewX, scaleY, translateX, translateY]
      const [_, __, ___, ____, x, y] = item.transform;
      return {
        text: item.str,
        x,
        y: viewport.height - y, // Invert Y to match web coordinates
        width: item.width,
        height: item.height,
        font: item.fontName
      };
    });
    allItems.push(...pageItems);
  }
  return allItems;
}