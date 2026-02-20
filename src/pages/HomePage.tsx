import React, { useState, useEffect } from 'react';
import { AdScanner } from '@/components/AdScanner';
import { AnalysisResult } from '@/components/AnalysisResult';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster, toast } from '@/components/ui/sonner';
import { AD_ANALYST_PROMPT } from '@/lib/agent-prompts';
import { chatService } from '@/lib/chat';
import { parseAnalysisResponse, AdAnalysis } from '@/lib/ad-utils';
import { ScanSearch, RefreshCw, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHistoryStore } from '@/lib/history-store';
import { Link, useLocation } from 'react-router-dom';

export function HomePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AdAnalysis | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const addScan = useHistoryStore(s => s.addScan);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.selectedScan) {
      setResult(location.state.selectedScan.analysis);
      setCurrentImage(location.state.selectedScan.imagePreview);
    }
  }, [location.state]);

  const handleScanComplete = async (text: string, imagePreview: string) => {
    if (!text.trim()) {
      toast.error("No text found in ad. Try a clearer shot!");
      return;
    }
    setIsAnalyzing(true);
    setCurrentImage(imagePreview);
    try {
      // Start a fresh session for the analyst
      chatService.newSession();
      const prompt = `${AD_ANALYST_PROMPT}\n\nHere is the extracted text from the advertisement:\n"${text}"\n\nAnalyze it now.`;
      const response = await chatService.sendMessage(prompt);
      if (response.success && response.data?.messages) {
        const lastMessage = response.data.messages[response.data.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
          const parsed = parseAnalysisResponse(lastMessage.content);
          setResult(parsed);
          addScan({
            analysis: parsed,
            extractedText: text,
            imagePreview: imagePreview
          });
          toast.success("Analysis complete!");
        }
      } else {
        throw new Error(response.error || "Analysis failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Agent went dark. Check your connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };
  const reset = () => {
    setResult(null);
    setIsScanning(false);
    setIsAnalyzing(false);
  };
  return (
    <div className="min-h-screen bg-[#FDFBF7] text-black selection:bg-[#FFD23F] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-10 lg:py-12">
          <header className="flex flex-col items-center mb-12 text-center">
            <div className="relative">
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic border-b-8 border-black leading-[0.8] mb-2">
                AdXRay
              </h1>
              <div className="absolute -right-4 -top-4 bg-primary text-white text-xs font-bold px-2 py-1 rotate-12 uppercase">
                v1.0 Beta
              </div>
            </div>
            <p className="mt-4 text-xl font-bold uppercase tracking-widest text-gray-600">
              The Truth Behind the Hype
            </p>
          </header>
          <main className="relative flex flex-col items-center">
            <Link to="/history" className="absolute -top-16 right-0 md:right-0">
              <Button variant="outline" className="border-2 border-black shadow-hard-sm uppercase font-bold hover:translate-y-0.5 transition-all">
                <Archive className="mr-2 h-4 w-4" /> Vault
              </Button>
            </Link>
            {!result ? (
              <>
                <div className="mb-8 w-full">
                  <AdScanner onScanComplete={(text) => handleScanComplete(text, currentImage || '')} isScanning={isAnalyzing} onImageCapture={(img) => setCurrentImage(img)} />
                </div>
                {isAnalyzing && (
                  <div className="mt-8 flex flex-col items-center animate-pulse">
                    <ScanSearch className="w-12 h-12 mb-2" />
                    <p className="font-bold uppercase tracking-widest text-sm">Consulting the Expert...</p>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center max-w-xl mx-auto mb-4">
                   <h2 className="text-2xl font-black uppercase">Report #001</h2>
                   <Button variant="ghost" size="sm" onClick={reset} className="font-bold uppercase border-2 border-black">
                     <RefreshCw className="mr-2 h-4 w-4" /> New Scan
                   </Button>
                </div>
                <AnalysisResult data={result} />
              </div>
            )}
          </main>
          <footer className="mt-20 border-t-2 border-black pt-8 flex flex-col items-center gap-4 text-center">
             <div className="bg-black text-white p-4 max-w-md">
                <p className="text-xs font-mono uppercase leading-tight">
                  NOTICE: AdXRay analysis is generated by AI. Use common sense. Not financial advice. 
                  Limit on AI requests across all apps applies.
                </p>
             </div>
             <p className="text-sm font-bold uppercase">© 2024 ADXRAY BUREAU OF TRUTH</p>
          </footer>
        </div>
      </div>
      <ThemeToggle className="fixed bottom-4 right-4" />
      <Toaster richColors position="top-center" />
    </div>
  );
}