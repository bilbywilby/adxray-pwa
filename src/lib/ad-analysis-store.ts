import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AdAnalysis } from './ad-utils';
export type AppStatus = 'IDLE' | 'CAPTURING' | 'ANALYZING' | 'REPORTING' | 'ERROR';
interface AdXRayState {
  status: AppStatus;
  currentAnalysis: AdAnalysis | null;
  capturedImage: string | null;
  history: Array<{ id: string; timestamp: number; image: string; analysis: AdAnalysis }>;
  settings: {
    apiKey: string;
    precisionMode: boolean;
  };
  error: string | null;
  setStatus: (status: AppStatus) => void;
  setAnalysis: (analysis: AdAnalysis) => void;
  setCapturedImage: (image: string | null) => void;
  addScanToHistory: (image: string, analysis: AdAnalysis) => void;
  updateSettings: (settings: Partial<AdXRayState['settings']>) => void;
  setError: (error: string | null) => void;
  clearHistory: () => void;
}
export const useAdXRayStore = create<AdXRayState>()(
  persist(
    (set) => ({
      status: 'IDLE',
      currentAnalysis: null,
      capturedImage: null,
      history: [],
      settings: {
        apiKey: '',
        precisionMode: true,
      },
      error: null,
      setStatus: (status) => set({ status }),
      setAnalysis: (currentAnalysis) => set({ currentAnalysis, status: 'REPORTING' }),
      setCapturedImage: (capturedImage) => set({ capturedImage }),
      addScanToHistory: (image, analysis) => set((state) => ({
        history: [{ id: crypto.randomUUID(), timestamp: Date.now(), image, analysis }, ...state.history]
      })),
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      setError: (error) => set({ error, status: 'ERROR' }),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'adxray-pwa-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);