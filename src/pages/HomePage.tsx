import React from 'react';
import { PDFUploader } from '@/components/PDFUploader';
import { ExtractionPreview } from '@/components/ExtractionPreview';
import { useExtractionStore } from '@/lib/extraction-store';
import { Toaster } from '@/components/ui/sonner';
import { Terminal, Archive, ShieldAlert, Info, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
export function HomePage() {
  const status = useExtractionStore(s => s.status);
  const error = useExtractionStore(s => s.error);
  const navigate = useNavigate();
  return (
    <AppLayout container className="bg-background min-h-screen">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header - Simplified as brand is in Sidebar */}
        <section className="text-center space-y-6 py-8 md:py-12">
          <h1 className="text-5xl md:text-7xl font-display font-black leading-none uppercase italic">
            Digital Document <span className="text-primary">Intelligence.</span>
          </h1>
          <p className="text-gray-400 font-medium max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Strip away the noise. Extract structured truth from unstructured PDFs using layout-aware neural parsing and cynical AI analysis.
          </p>
        </section>
        {/* Uploader Section */}
        <section className="space-y-6">
          <PDFUploader />
          {error && (
            <div className="p-4 border border-red-500/50 bg-red-500/10 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <span className="text-xs font-mono text-red-400 uppercase tracking-tight">{error}</span>
            </div>
          )}
          {status === 'idle' && !error && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-2 text-gray-600 font-mono text-[10px] uppercase tracking-widest">
                <Info className="w-3 h-3" />
                <span>Ready for ingestion. Upload a PDF to begin extraction.</span>
              </div>
            </div>
          )}
        </section>
        {/* Results Section */}
        <section className="py-8">
          <ExtractionPreview />
        </section>
        {/* Mandatory AI Limit Disclaimer */}
        <section className="pt-12 pb-24">
          <div className="max-w-2xl mx-auto p-4 border border-white/5 bg-white/[0.02] flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-yellow-500/50 shrink-0 mt-0.5" />
            <p className="text-[10px] font-mono text-gray-500 uppercase leading-relaxed">
              <span className="text-gray-400 font-bold">Protocol Notice:</span> AI operations are subject to shared global rate limits. 
              Performance and latency may vary during peak processing windows or high-concurrency events. 
              All data remains local to your vault session.
            </p>
          </div>
        </section>
      </div>
      {/* Footer Meta */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 flex justify-between items-center bg-[#0a0a0a]/80 backdrop-blur-sm border-t border-[#111] pointer-events-none z-40 ml-0 lg:ml-0">
        <div className="flex items-center gap-2 opacity-30">
          <Terminal className="w-3 h-3" />
          <span className="font-mono text-[8px] uppercase tracking-widest">Protocol: DOCXRAY_INTEL_v5.0</span>
        </div>
        <div className="flex items-center gap-2 opacity-30">
          <span className="font-mono text-[8px] uppercase tracking-widest text-primary">System Online</span>
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
        </div>
      </footer>
      <Toaster position="top-right" theme="dark" richColors />
    </AppLayout>
  );
}