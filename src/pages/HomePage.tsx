import React, { useState, useCallback, useRef } from 'react';
import { AdScanner } from '@/components/AdScanner';
import { AnalysisResult } from '@/components/AnalysisResult';
import { Toaster, toast } from '@/components/ui/sonner';
import { AdAnalysis } from '@/lib/ad-utils';
import { Scan, ShieldAlert, Loader2, ArrowLeft, Info, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
type ScreenState = 'splash' | 'capture' | 'processing' | 'results' | 'error';
export function HomePage() {
  const [screen, setScreen] = useState<ScreenState>('splash');
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [results, setResults] = useState<AdAnalysis | null>(null);
  const [step, setStep] = useState(0);
  const steps = ["Decrypting visual stream...", "Identifying product footprint...", "Cross-referencing market data...", "Evaluating competitor threats...", "Finalizing verdict..."];
  const handleCapture = async (b64: string) => {
    setImageB64(b64);
    setScreen('processing');
    // Simulate progression for UX
    const timer = setInterval(() => {
      setStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 800);
    try {
      const response = await fetch('/api/ad-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageB64: b64 })
      });
      const res = await response.json();
      if (res.success) {
        setResults(res.data);
        setTimeout(() => {
          clearInterval(timer);
          setScreen('results');
        }, 1200);
      } else {
        throw new Error(res.error);
      }
    } catch (err) {
      clearInterval(timer);
      setScreen('error');
      toast.error("Analysis failed. Signal lost.");
    }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-lime-accent selection:text-black overflow-hidden flex flex-col items-center">
      {/* Top Nav */}
      <nav className="w-full max-w-[430px] p-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-1 font-condensed text-2xl font-black">
          AD<span className="text-lime-accent">X</span>RAY
        </div>
        <div className="flex gap-2">
          <div className="bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-bold border border-[#333] tracking-wider text-lime-accent">BETA</div>
          <div className="bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-bold border border-[#333] tracking-wider text-gray-500">v3.0</div>
        </div>
      </nav>
      <main className="w-full max-w-[430px] flex-1 relative flex flex-col">
        <AnimatePresence mode="wait">
          {screen === 'splash' && (
            <motion.div 
              key="splash"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex-1 flex flex-col p-8 justify-center items-center text-center space-y-12"
            >
              <div className="space-y-4">
                <h2 className="text-5xl font-condensed font-black leading-none">SEE THROUGH EVERY AD.</h2>
                <p className="text-gray-400 font-medium max-w-[280px]">The truth is hidden in the pixels. Reveal predatory marketing with one scan.</p>
              </div>
              <div className="w-full space-y-4 text-left font-mono text-xs text-gray-500 border-l border-lime-accent/30 pl-4 py-2">
                <p>1. Capture visual data</p>
                <p>2. Cloud AI decomposition</p>
                <p>3. Market integrity report</p>
              </div>
              <button 
                onClick={() => setScreen('capture')}
                className="w-full py-4 bg-lime-accent text-black font-condensed text-xl font-black hover:scale-105 transition-transform active:scale-95"
              >
                INITIATE ANALYSIS
              </button>
            </motion.div>
          )}
          {screen === 'capture' && (
            <motion.div key="capture" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
              <AdScanner onCapture={handleCapture} onBack={() => setScreen('splash')} />
            </motion.div>
          )}
          {screen === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center p-8 space-y-12">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-lime-accent/20 rounded-full animate-ping" />
                <div className="absolute inset-2 border-2 border-lime-accent rounded-full animate-spin-slow" />
                <Activity className="w-10 h-10 text-lime-accent" />
              </div>
              <div className="w-full space-y-6">
                <div className="text-center">
                  <h3 className="font-condensed text-2xl font-bold animate-pulse text-lime-accent">ANALYZING TARGET</h3>
                </div>
                <div className="space-y-3 font-mono text-[10px] uppercase tracking-widest text-gray-500">
                  {steps.map((s, i) => (
                    <div key={i} className={`flex items-center gap-3 ${i === step ? 'text-white' : i < step ? 'text-lime-accent' : ''}`}>
                      {i < step ? '✓' : i === step ? '▶' : '○'} {s}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          {screen === 'results' && results && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex-1 overflow-y-auto no-scrollbar pb-24 p-6">
              <div className="flex items-center justify-between mb-8">
                <button onClick={() => setScreen('capture')} className="p-2 bg-[#1a1a1a] border border-[#333]"><ArrowLeft className="w-4 h-4" /></button>
                <h3 className="font-condensed text-xl font-bold">X-RAY REPORT</h3>
                <div className="w-8" />
              </div>
              <div className="aspect-video w-full bg-dark-surface border border-[#333] mb-8 overflow-hidden">
                <img src={`data:image/jpeg;base64,${imageB64}`} className="w-full h-full object-contain grayscale brightness-75" alt="Scan" />
              </div>
              <AnalysisResult data={results} />
              <button 
                onClick={() => setScreen('capture')}
                className="w-full mt-12 py-4 bg-white text-black font-condensed text-xl font-black"
              >
                NEW SCAN
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Toaster position="top-center" theme="dark" />
    </div>
  );
}