import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAdXRayStore } from '@/lib/ad-analysis-store';
import { AdScanner } from '@/components/AdScanner';
import { AdAnalysisView } from '@/components/AdAnalysisView';
import { SettingsOverlay } from '@/components/SettingsOverlay';
import { Settings, Shield, Info, AlertTriangle, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
export function HomePage() {
  const status = useAdXRayStore(s => s.status);
  const currentAnalysis = useAdXRayStore(s => s.currentAnalysis);
  const apiKey = useAdXRayStore(s => s.settings.apiKey);
  const setStatus = useAdXRayStore(s => s.setStatus);
  const setAnalysis = useAdXRayStore(s => s.setAnalysis);
  const setError = useAdXRayStore(s => s.setError);
  const addScanToHistory = useAdXRayStore(s => s.addScanToHistory);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const handleCapture = async (b64: string) => {
    setStatus('ANALYZING');
    try {
      const response = await fetch('/api/analyze-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: b64, apiKey })
      });
      const res = await response.json();
      if (!res.success) throw new Error(res.error || 'ANALYSIS_PROTOCOL_FAILED');
      setAnalysis(res.data);
      addScanToHistory(b64, res.data);
      toast.success("Intelligence report generated.");
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    }
  };
  return (
    <AppLayout container className="bg-background min-h-screen">
      <div className="max-w-xl mx-auto space-y-12">
        {/* Header Protocol */}
        <header className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase italic tracking-tighter leading-none">
              Deep <span className="text-lime-accent">Scanner</span>
            </h1>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">AdXRay Intelligence v5.0</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSettingsOpen(true)}
            className="h-12 w-12 border border-white/10 text-white hover:bg-white/5"
          >
            <Settings size={20} />
          </Button>
        </header>
        {/* State Machine Views */}
        <main className="min-h-[400px]">
          {status === 'IDLE' && (
            <div className="space-y-10">
              <div 
                onClick={() => setStatus('CAPTURING')}
                className="group relative w-full aspect-square border-2 border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center cursor-pointer transition-all hover:border-lime-accent/50 hover:bg-lime-accent/5"
              >
                <div className="absolute top-4 left-4 font-mono text-[10px] text-gray-700 uppercase">Input_Source_v5</div>
                <div className="p-8 bg-white/5 border border-white/10 group-hover:border-lime-accent/40 group-hover:scale-110 transition-all">
                  <Zap size={48} className="text-gray-500 group-hover:text-lime-accent" />
                </div>
                <div className="mt-8 text-center px-6">
                  <h3 className="font-display text-2xl font-black uppercase italic text-white">Initialize Scan</h3>
                  <p className="font-mono text-[10px] text-gray-600 uppercase mt-1">Camera or Gallery Access Required</p>
                </div>
              </div>
              <section className="p-4 border border-white/5 bg-white/[0.01] flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-yellow-500/50 shrink-0 mt-0.5" />
                <p className="text-[10px] font-mono text-gray-600 uppercase leading-relaxed">
                  Notice: Operations are subject to shared global rate limits. 
                  Images are processed for analysis and purged immediately.
                </p>
              </section>
            </div>
          )}
          {status === 'CAPTURING' && (
            <AdScanner 
              onCapture={handleCapture} 
              onBack={() => setStatus('IDLE')} 
            />
          )}
          {status === 'ANALYZING' && (
            <div className="flex flex-col items-center justify-center py-24 space-y-8">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-lime-accent animate-spin" />
                <div className="absolute inset-0 bg-lime-accent/20 blur-2xl animate-pulse" />
              </div>
              <div className="text-center">
                <h3 className="font-display text-3xl font-black uppercase italic tracking-widest text-lime-accent">Processing...</h3>
                <p className="font-mono text-[10px] text-gray-500 uppercase mt-1">Bypassing Ad Persuasion Filters</p>
              </div>
            </div>
          )}
          {status === 'REPORTING' && currentAnalysis && (
            <AdAnalysisView 
              data={currentAnalysis} 
              onReset={() => setStatus('IDLE')} 
            />
          )}
          {status === 'ERROR' && (
            <div className="p-8 border-2 border-red-500/30 bg-red-500/5 text-center space-y-6">
              <h3 className="font-display text-2xl font-black uppercase italic text-red-500">Scan Interrupted</h3>
              <p className="font-mono text-xs text-red-400/80 uppercase">AI Protocol Failed to Decode Ad Matrix.</p>
              <Button onClick={() => setStatus('IDLE')} variant="outline" className="border-red-500/20 text-red-400 hover:bg-red-500/10">
                Retry Connection
              </Button>
            </div>
          )}
        </main>
        {/* Footer Meta */}
        <footer className="pt-12 pb-8 border-t border-white/5 opacity-30 flex justify-between items-center font-mono text-[8px] uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Shield size={10} />
            <span>Encrypted Session</span>
          </div>
          <span>AdXRay_Local_v5.0.1</span>
        </footer>
      </div>
      <SettingsOverlay open={settingsOpen} onOpenChange={setSettingsOpen} />
      <Toaster position="top-center" theme="dark" richColors />
    </AppLayout>
  );
}