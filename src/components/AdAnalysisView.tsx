import React from 'react';
import { AdAnalysis, getVerdictColor } from '@/lib/ad-utils';
import { motion } from 'framer-motion';
import { Target, AlertTriangle, TrendingDown, Share2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface AdAnalysisViewProps {
  data: AdAnalysis;
  onReset: () => void;
}
export function AdAnalysisView({ data, onReset }: AdAnalysisViewProps) {
  const { detected, whyThisAd, marketComparison } = data;
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* SECTION 1: THE DETECTION */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }}
        className="bg-dark-surface border-2 border-white/10 p-6 relative shadow-[4px_4px_0px_0px_rgba(200,241,53,1)]"
      >
        <div className="absolute top-0 right-0 p-2 bg-lime-accent text-black font-display font-black text-[10px] uppercase tracking-tighter">
          {detected.confidence}% MATCH
        </div>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-4xl">{detected.emoji}</span>
          <div>
            <h4 className="text-lime-accent font-display text-xs font-bold uppercase tracking-widest">Target Entity</h4>
            <p className="text-2xl font-display font-black uppercase italic leading-none">{detected.productName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-[10px] font-mono uppercase tracking-widest text-gray-500">
          <div><span className="block text-white/40">Brand:</span> {detected.company}</div>
          <div><span className="block text-white/40">Sector:</span> {detected.category}</div>
        </div>
      </motion.div>
      {/* SECTION 2: THE TRAP */}
      <motion.div 
        initial={{ x: 20, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-surface border-2 border-white/10 p-6 space-y-4 shadow-[4px_4px_0px_0px_rgba(255,112,166,1)]"
      >
        <div className="flex items-center gap-2 text-[#FF70A6] font-display font-black text-xl italic uppercase">
          <Target size={20} /> THE PSYCHOLOGY
        </div>
        <p className="text-sm text-gray-300 leading-relaxed font-medium">{whyThisAd.summary}</p>
        <div className="flex flex-wrap gap-2">
          {whyThisAd.tactics.map(t => (
            <span key={t} className="px-2 py-0.5 bg-[#FF70A6]/10 border border-[#FF70A6]/30 text-[#FF70A6] text-[9px] font-mono uppercase font-bold">
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
        className={`bg-dark-surface border-2 p-6 space-y-6 shadow-[4px_4px_0px_0px_rgba(112,214,255,1)] ${getVerdictColor(marketComparison.verdict)}`}
      >
        <div className="flex items-center gap-2 font-display font-black text-xl italic uppercase">
          <TrendingDown size={20} /> MARKET REALITY
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs font-mono border-b border-white/10 pb-2">
            <span className="text-white/60 uppercase">Advertised Deal</span>
            <span className="font-bold text-white">{marketComparison.advertised.deal} ({marketComparison.advertised.price})</span>
          </div>
          {marketComparison.alternatives.map((alt, i) => (
            <div key={i} className="flex justify-between items-center text-[10px] font-mono opacity-60">
              <span className="uppercase">{alt.emoji} {alt.name}</span>
              <span className="font-bold">{alt.price} - {alt.reason}</span>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t border-white/10">
          <h5 className="font-display text-2xl font-black uppercase italic leading-none mb-1">{marketComparison.verdictTitle}</h5>
          <p className="text-xs font-medium text-white/80">{marketComparison.verdictText}</p>
        </div>
      </motion.div>
      <div className="flex gap-4 pt-4">
        <Button onClick={onReset} className="flex-1 h-14 bg-white text-black font-display font-black text-lg rounded-none hover:bg-gray-200">
          <RefreshCw className="mr-2" size={20} /> NEW SCAN
        </Button>
        <Button variant="outline" className="h-14 w-14 border-white/20 text-white rounded-none">
          <Share2 size={24} />
        </Button>
      </div>
    </div>
  );
}