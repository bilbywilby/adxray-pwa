import React from 'react';
import { AdAnalysis } from '@/lib/ad-utils';
import { Target, ShieldCheck, TrendingDown, Info } from 'lucide-react';
interface AnalysisResultProps {
  data: AdAnalysis;
}
export function AnalysisResult({ data }: AnalysisResultProps) {
  const { detected, whyThisAd, marketComparison } = data;
  return (
    <div className="space-y-8 font-sans">
      {/* Card 1: Detection */}
      <section className="bg-[#111] border border-[#222] p-6 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 bg-blue-500/10 text-blue-400 font-condensed text-[10px] font-bold uppercase tracking-widest border-l border-b border-[#222]">CONFIDENCE {detected.confidence}%</div>
        <div className="flex items-center gap-4">
          <div className="text-4xl">{detected.emoji}</div>
          <div>
            <h4 className="font-condensed text-xs text-gray-500 font-bold uppercase tracking-widest">Target Detected</h4>
            <p className="font-condensed text-2xl font-black">{detected.productName}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#222] text-[10px] font-mono">
          <div><span className="text-gray-600 uppercase block">Entity:</span> {detected.company}</div>
          <div><span className="text-gray-600 uppercase block">Category:</span> {detected.category}</div>
        </div>
        <div className="w-full h-1 bg-gray-900 overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${detected.confidence}%` }} />
        </div>
      </section>
      {/* Card 2: Why This Ad */}
      <section className="bg-[#111] border border-[#222] p-6 space-y-6">
        <div className="flex items-center gap-2 font-condensed text-xl font-bold text-red-500">
          <Target className="w-5 h-5" /> THE PSYCHOLOGY
        </div>
        <p className="text-sm text-gray-300 leading-relaxed font-medium">{whyThisAd.summary}</p>
        <div className="grid grid-cols-2 gap-2">
          {whyThisAd.insights.map((insight, idx) => (
            <div key={idx} className="bg-[#0a0a0a] border border-[#222] p-3 space-y-1">
              <span className="text-[8px] text-gray-600 font-mono uppercase tracking-widest">{insight.label}</span>
              <p className="text-[10px] font-bold text-white truncate">{insight.value}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {whyThisAd.tactics.map(t => (
            <span key={t} className="bg-red-500/10 text-red-400 text-[8px] font-mono uppercase border border-red-500/20 px-2 py-0.5">{t}</span>
          ))}
        </div>
      </section>
      {/* Card 3: Comparison */}
      <section className="bg-[#111] border border-[#222] p-6 space-y-6">
        <div className="flex items-center gap-2 font-condensed text-xl font-bold text-lime-accent">
          <TrendingDown className="w-5 h-5" /> MARKET REALITY
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-[9px]">
            <thead>
              <tr className="text-gray-600 border-b border-[#222]">
                <th className="pb-2">UNIT</th>
                <th className="pb-2">VAL</th>
                <th className="pb-2">DEAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              <tr className="bg-lime-accent/10">
                <td className="py-3 text-white font-bold">{marketComparison.advertised.name.slice(0, 10)}..</td>
                <td className="py-3 text-lime-accent">{marketComparison.advertised.price}</td>
                <td className="py-3 text-white">{marketComparison.advertised.deal}</td>
              </tr>
              {marketComparison.alternatives.map((alt, idx) => (
                <tr key={idx} className="text-gray-500">
                  <td className="py-3">{alt.emoji} {alt.name.slice(0, 10)}..</td>
                  <td className="py-3">{alt.price}</td>
                  <td className="py-3">{alt.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={`p-4 border-2 ${
          marketComparison.verdict === 'bad' ? 'border-red-500 bg-red-500/10' : 
          marketComparison.verdict === 'good' ? 'border-lime-accent bg-lime-accent/10' : 
          'border-yellow-500 bg-yellow-500/10'
        }`}>
          <h5 className="font-condensed text-xl font-black italic">{marketComparison.verdictTitle}</h5>
          <p className="text-xs mt-1 font-medium">{marketComparison.verdictText}</p>
        </div>
      </section>
    </div>
  );
}