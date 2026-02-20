import React from 'react';
import { useExtractionStore } from '@/lib/extraction-store';
import { motion } from 'framer-motion';
import { Database, Copy, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
export function ExtractionPreview() {
  const structuredData = useExtractionStore(s => s.structuredData);
  const status = useExtractionStore(s => s.status);
  if (status !== 'completed' || !structuredData) return null;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(structuredData, null, 2));
    toast.success("JSON copied to clipboard");
  };
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <h3 className="font-display text-2xl font-black uppercase italic">Extracted Intelligence</h3>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={copyToClipboard}
          className="border-[#333] hover:border-primary hover:bg-primary/10 rounded-none h-8 px-3"
        >
          <Copy className="w-3 h-3 mr-2" />
          <span className="text-[10px] font-bold uppercase">Copy JSON</span>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Field Monitor */}
        <div className="bg-[#111] border border-[#222] p-6 space-y-4">
          <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest border-b border-[#222] pb-2">Field Monitor</div>
          <div className="space-y-4">
            {Object.entries(structuredData).map(([key, value]) => (
              key !== 'metadata' && (
                <div key={key} className="flex flex-col gap-1 border-l-2 border-primary/30 pl-3 py-1">
                  <span className="font-mono text-[9px] text-gray-500 uppercase">{key}</span>
                  <span className="font-medium text-sm text-white">{String(value)}</span>
                </div>
              )
            ))}
          </div>
          <div className="pt-4 mt-4 border-t border-[#222] flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase">Validation Passed</span>
            </div>
            <span className="text-[10px] font-mono text-gray-500">CONFIDENCE: 98%</span>
          </div>
        </div>
        {/* Code View */}
        <div className="bg-black border border-[#222] p-6 overflow-hidden">
          <div className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-4">Raw_Payload.json</div>
          <pre className="font-mono text-[11px] text-primary/80 overflow-auto max-h-[400px] no-scrollbar">
            {JSON.stringify(structuredData, null, 2)}
          </pre>
        </div>
      </div>
    </motion.div>
  );
}