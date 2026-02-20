import { TextItem } from './textExtractor';
export function analyzeLayout(items: TextItem[]): string {
  if (items.length === 0) return "";
  // Group by Y coordinate (lines) with 5px tolerance
  const lines: { y: number; items: TextItem[] }[] = [];
  const TOLERANCE = 5;
  items.forEach(item => {
    let line = lines.find(l => Math.abs(l.y - item.y) < TOLERANCE);
    if (!line) {
      line = { y: item.y, items: [] };
      lines.push(line);
    }
    line.items.push(item);
  });
  // Sort lines by Y (top to bottom)
  lines.sort((a, b) => a.y - b.y);
  // For each line, sort items by X (left to right) and join
  const reconstructed = lines.map(line => {
    return line.items
      .sort((a, b) => a.x - b.x)
      .map(i => i.text)
      .join(" ");
  });
  return reconstructed.join("\n");
}