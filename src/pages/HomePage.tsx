import React from 'react';
import { PDFUploader } from '@/components/PDFUploader';
import { ExtractionPreview } from '@/components/ExtractionPreview';
import { useExtractionStore } from '@/lib/extraction-store';
import { Toaster } from '@/components/ui/sonner';
import { Terminal, Archive, ShieldInfo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function HomePage() {
  const status = useExtractionStore(s => s.status);
  const error = useExtractionStore(s => s.error);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-primary selection:text-black">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 font-display text-3xl font-black">
          DOC<span className="text-primary italic">XRAY</span>
          <div className="bg-primary px-1 text-[10px] font-bold text-black uppercase ml-1">BETA</div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/history')}
            className="flex items-center gap-2 px-3 py-1 border border-[#333] hover:border-primary transition-colors bg-[#111]"
          >
            <Archive className="w-4 h-4 text-primary" />
            <span className="font-display text-sm font-bold uppercase">Vault</span>
          </button>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <section className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-display font-black leading-none uppercase italic">
              Digital Document <span className="text-primary">Intelligence.</span>
            </h1>
            <p className="text-gray-400 font-medium max-w-2xl mx-auto text-sm md:text-base">
              Strip away the noise. Extract structured truth from unstructured PDFs using layout-aware neural parsing.
            </p>
          </section>
          {/* Uploader Section */}
          <section className="space-y-6">
            <PDFUploader />
            {error && (
              <div className="p-4 border border-red-500/50 bg-red-500/10 flex items-center gap-3">
                <ShieldInfo className="w-5 h-5 text-red-500" />
                <span className="text-xs font-mono text-red-400 uppercase tracking-tight">{error}</span>
              </div>
            )}
          </section>
          {/* Results Section */}
          <section>
            <ExtractionPreview />
          </section>
        </div>
      </main>
      {/* Footer Meta */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-[#0a0a0a] border-t border-[#111] pointer-events-none">
        <div className="flex items-center gap-2 opacity-30">
          <Terminal className="w-3 h-3" />
          <span className="font-mono text-[8px] uppercase tracking-widest">Protocol: X-RAY_INTEL_v5.0</span>
        </div>
        <div className="flex items-center gap-2 opacity-30">
          <span className="font-mono text-[8px] uppercase tracking-widest text-primary">System Online</span>
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
        </div>
      </footer>
      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
}