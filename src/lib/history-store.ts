import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AdAnalysis } from './ad-utils';
export interface ScanRecord {
  id: string;
  timestamp: number;
  imagePreview: string;
  analysis: AdAnalysis;
  extractedText: string;
}
interface HistoryState {
  scans: ScanRecord[];
  addScan: (scan: Omit<ScanRecord, 'id' | 'timestamp'>) => void;
  removeScan: (id: string) => void;
  clearHistory: () => void;
}
export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      scans: [],
      addScan: (scan) => set((state) => ({
        scans: [
          {
            ...scan,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
          },
          ...state.scans,
        ],
      })),
      removeScan: (id) => set((state) => ({
        scans: state.scans.filter((s) => s.id !== id),
      })),
      clearHistory: () => set({ scans: [] }),
    }),
    {
      name: 'adxray-vault',
      storage: createJSONStorage(() => localStorage),
    }
  )
);