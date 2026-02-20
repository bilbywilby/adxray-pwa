import React from 'react';
import { AdAnalysis, getVerdictColor } from '@/lib/ad-utils';
import { motion } from 'framer-motion';
import { Target, TrendingDown, Share2, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
interface AdAnalysisViewProps {
  data: AdAnalysis;
  onReset: () => void;
}
export function AdAnalysisView({ data, onReset }: AdAnalysisViewProps) {
  const { detected, whyThisAd, marketComparison } = data;
  const [copied, setCopied] = React.useState(false);
  const handleCopy = () => {
    const text = `ADXRAY INTELLIGENCE REPORT
Target: ${detected.productName} (${detected.company})
Verdict: ${marketComparison.verdictTitle}
Summary: ${whyThisAd.summary}
Reality: ${marketComparison.verdictText}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Intelligence payload copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };
  const verdictStyles = getVerdictColor(marketComparison.verdict);
  return (
    <div className="space-y-8">
      {/* SECTION 1: THE DETECTION */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-dark-surface border-2 border-white/5 p-6 relative shadow-[4px_4px_0px_0px_rgba(200,241,53,0.5)]"
      >
        <div className="absolute top-0 right-0 p-2 bg-lime-accent text-black font-display font-black text-[10px] uppercase tracking-tighter">
          {detected.confidence}% CONFIRMED
        </div>
        <div className="flex items-center gap-5 mb-5">
          <span className="text-5xl drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{detected.emoji}</span>
          <div className="space-y-1">
            <h4 className="text-lime-accent font-display text-[10px] font-bold uppercase tracking-[0.2em]">Primary Target</h4>
            <p className="text-2xl font-display font-black uppercase italic leading-none text-white tracking-tight">{detected.productName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-[9px] font-mono uppercase tracking-widest text-gray-500 pt-4 border-t border-white/5">
          <div className="flex flex-col gap-1"><span className="text-white/30">Entity:</span> {detected.company}</div>
          <div className="flex flex-col gap-1"><span className="text-white/30">Sector:</span> {detected.category}</div>
        </div>
      </motion.div>
      {/* SECTION 2: THE TRAP */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-surface border-2 border-white/5 p-6 space-y-4 shadow-[4px_4px_0px_0px_rgba(255,112,166,0.5)]"
      >
        <div className="flex items-center gap-2 text-[#FF70A6] font-display font-black text-xl italic uppercase tracking-tighter">
          <Target size={20} /> PSYCHOLOGICAL HOOKS
        </div>
        <p className="text-sm text-gray-300 leading-relaxed font-medium font-sans">{whyThisAd.summary}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {whyThisAd.tactics.map(t => (
            <span key={t} className="px-2 py-1 bg-[#FF70A6]/5 border border-[#FF70A6]/20 text-[#FF70A6] text-[9px] font-mono uppercase font-black">
              {t}
            </span>
          ))}
        </div>
      </motion.div>
      {/* SECTION 3: THE VERDICT */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`bg-dark-surface border-2 p-6 space-y-6 shadow-[4px_4px_0px_0px_rgba(112,214,255,0.5)] ${verdictStyles}`}
      >
        <div className="flex items-center gap-2 font-display font-black text-xl italic uppercase tracking-tighter">
          <TrendingDown size={20} /> MARKET COMPARISON
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-3">
            <span className="text-white/40 uppercase">Claimed Deal</span>
            <span className="font-bold text-white bg-white/5 px-2 py-0.5">{marketComparison.advertised.deal} ({marketComparison.advertised.price})</span>
          </div>
          <div className="space-y-3">
            {marketComparison.alternatives.map((alt, i) => (
              <div key={i} className="flex justify-between items-start text-[10px] font-mono group">
                <span className="uppercase text-gray-500 group-hover:text-white transition-colors">{alt.emoji} {alt.name}</span>
                <div className="text-right">
                  <span className="font-bold text-white block">{alt.price}</span>
                  <span className="text-[8px] text-gray-600 uppercase italic">{alt.reason}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-6 border-t border-white/5">
          <h5 className="font-display text-2xl font-black uppercase italic leading-none mb-2 tracking-tighter">{marketComparison.verdictTitle}</h5>
          <p className="text-xs font-medium text-white/80 leading-relaxed">{marketComparison.verdictText}</p>
        </div>
      </motion.div>
      <div className="flex gap-4 pt-4 pb-10">
        <Button onClick={onReset} className="flex-1 h-14 bg-white text-black font-display font-black text-xl rounded-none hover:bg-gray-200 transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
          <RefreshCw className="mr-2" size={20} /> NEW SCAN
        </Button>
        <Button 
          variant="outline" 
          onClick={handleCopy}
          className="h-14 w-14 border-white/10 text-white rounded-none hover:bg-white/5 active:scale-95 transition-all"
        >
          {copied ? <Check size={24} className="text-lime-accent" /> : <Copy size={24} />}
        </Button>
      </div>
    </div>
  );
}