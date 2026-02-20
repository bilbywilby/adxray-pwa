import { create } from 'zustand';
export type ExtractionStatus = 'idle' | 'loading' | 'processing' | 'parsing' | 'completed' | 'error';
interface ExtractionState {
  status: ExtractionStatus;
  currentFile: string | null;
  rawText: string;
  structuredData: Record<string, any>;
  error: string | null;
  setStatus: (status: ExtractionStatus) => void;
  setFile: (name: string | null) => void;
  setResults: (raw: string, structured: Record<string, any>) => void;
  setError: (msg: string | null) => void;
  reset: () => void;
}
export const useExtractionStore = create<ExtractionState>((set) => ({
  status: 'idle',
  currentFile: null,
  rawText: '',
  structuredData: {},
  error: null,
  setStatus: (status) => set({ status }),
  setFile: (currentFile) => set({ currentFile }),
  setResults: (rawText, structuredData) => set({ rawText, structuredData, status: 'completed' }),
  setError: (error) => set({ error, status: 'error' }),
  reset: () => set({ status: 'idle', currentFile: null, rawText: '', structuredData: {}, error: null }),
}));