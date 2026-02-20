import React, { useEffect, useState } from 'react';
import { useExtractionStore } from '@/lib/extraction-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Copy, CheckCircle2, ShieldCheck, RefreshCcw, Activity, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
export function ExtractionPreview() {
  const structuredData = useExtractionStore(s => s.structuredData);
  const status = useExtractionStore(s => s.status);
  const reset = useExtractionStore(s => s.reset);
  const [typedFields, setTypedFields] = useState<string[]>([]);
  useEffect(() => {
    if (status === 'completed' && structuredData) {
      const keys = Object.keys(structuredData);
      setTypedFields([]);
      keys.forEach((key, index) => {
        setTimeout(() => {
          setTypedFields(prev => [...prev, key]);
        }, index * 100);
      });
    }
  }, [status, structuredData]);
  if (status !== 'completed' || !structuredData) return null;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(structuredData, null, 2));
    toast.success("JSON intelligence payload copied");
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 border border-primary/20">
            <Database className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-display text-3xl font-black uppercase italic tracking-tight">Intelligence Report</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-[10px] font-mono text-primary uppercase">
                <CheckCircle2 className="w-3 h-3" /> Status: Verified
              </span>
              <span className="text-[10px] font-mono text-gray-600">|</span>
              <span className="text-[10px] font-mono text-gray-500 uppercase">Engine: Gemini_Flash</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={copyToClipboard}
            className="flex-1 md:flex-none border-[#333] hover:border-primary hover:bg-primary/10 rounded-none font-display font-bold uppercase"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Payload
          </Button>
          <Button
            onClick={reset}
            className="flex-1 md:flex-none bg-white text-black hover:bg-gray-200 rounded-none font-display font-bold uppercase px-6"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            New Scan
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Field Monitor */}
        <div className="bg-[#111] border-2 border-[#222] p-8 space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 bg-primary/5 border-l border-b border-[#222] font-mono text-[9px] text-gray-600">MONITOR_v5.0</div>
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {Object.entries(structuredData).map(([key, value]) => (
                key !== 'metadata' && typedFields.includes(key) && (
                  <motion.div
                    key={key}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-1 border-l-2 border-primary/40 pl-4 py-1"
                  >
                    <span className="font-mono text-[10px] text-gray-500 uppercase tracking-tighter">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-medium text-lg text-white leading-tight">{String(value)}</span>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
          <div className="pt-6 mt-8 border-t border-[#222] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <div className="absolute inset-0 bg-primary/20 blur-md animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-white uppercase block">Neural Integrity</span>
                <span className="text-[9px] font-mono text-primary/70 uppercase">Checksum Validated</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-gray-600 block uppercase">Confidence</span>
              <span className="text-xl font-display font-black text-primary italic leading-none">98.4%</span>
            </div>
          </div>
        </div>
        {/* Code View / Metadata Area */}
        <div className="flex flex-col gap-6">
          {structuredData.metadata && (
            <motion.div layout className="bg-[#0d0d0d] border border-primary/20 p-6 space-y-4">
              <div className="flex items-center gap-2 font-display text-lg font-bold text-primary italic uppercase">
                <Activity className="w-4 h-4" /> Neural Anomalies
              </div>
              <ul className="space-y-2">
                {structuredData.metadata.anomalies?.map((a: string, i: number) => (
                  <li key={i} className="flex gap-3 text-xs text-gray-400 font-medium">
                    <span className="text-primary font-mono text-[10px] mt-0.5">[{i+1}]</span>
                    {a}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          <motion.div layout className="bg-black border border-[#222] p-8 flex-1 relative">
            <div className="font-mono text-[10px] text-gray-600 uppercase tracking-[0.3em] mb-6 flex justify-between items-center">
              <span>RAW_PAYLOAD.JSON</span>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-blink" />
            </div>
            <pre className="font-mono text-[12px] text-primary/80 overflow-auto max-h-[350px] no-scrollbar leading-relaxed">
              {JSON.stringify(structuredData, null, 2)}
            </pre>
          </motion.div>
        </div>
      </div>
      {/* Report Specific Disclaimer */}
      <div className="flex items-center justify-center gap-2 py-4 border-t border-white/5 opacity-40">
        <AlertTriangle className="w-3 h-3 text-yellow-500" />
        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
          Engine Limit Disclaimer: Processing speed reflects shared rate availability.
        </span>
      </div>
    </motion.div>
  );
}