import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
export interface ExtractionRecord {
  id: string;
  timestamp: number;
  fileName: string;
  fileSize?: number;
  rawText: string;
  structuredData: Record<string, any>;
}
interface HistoryState {
  records: ExtractionRecord[];
  addRecord: (record: Omit<ExtractionRecord, 'id' | 'timestamp'>) => void;
  removeRecord: (id: string) => void;
  clearHistory: () => void;
}
export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (record) => set((state) => ({
        records: [
          {
            ...record,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          },
          ...state.records,
        ],
      })),
      removeRecord: (id) => set((state) => ({
        records: state.records.filter((r) => r.id !== id),
      })),
      clearHistory: () => set({ records: [] }),
    }),
    {
      name: 'doc-xray-vault',
      storage: createJSONStorage(() => localStorage),
    }
  )
);