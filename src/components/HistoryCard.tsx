import React from 'react';
import { HistoryItem } from '@/lib/ad-analysis-store';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Target, Trash2, Shield } from 'lucide-react';
interface HistoryCardProps {
  item: HistoryItem;
  onClick: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}
export function HistoryCard({ item, onClick, onDelete }: HistoryCardProps) {
  const { analysis, image, timestamp, id } = item;
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: '#c8f135' }}
      onClick={() => onClick(item)}
      className="cursor-pointer bg-dark-surface p-4 border-2 border-white/5 transition-all relative group overflow-hidden shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] hover:shadow-[4px_4px_0px_0px_rgba(200,241,53,0.2)]"
    >
      {/* Ad Image Preview */}
      <div className="aspect-square w-full bg-black border border-white/5 flex items-center justify-center relative mb-4 overflow-hidden">
        <img 
          src={`data:image/jpeg;base64,${image}`} 
          alt={analysis.detected.productName}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 scale-105 group-hover:scale-100"
        />
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 px-2 py-0.5 border border-white/10">
          <span className="font-mono text-[8px] text-lime-accent uppercase">{analysis.detected.confidence}% MATCH</span>
        </div>
        <button 
          onClick={handleDelete}
          className="absolute top-2 right-2 p-2 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
            {format(timestamp, 'MMM d, HH:mm')}
          </span>
          <div className="flex items-center gap-1">
            <Shield className="w-2 h-2 text-lime-accent" />
            <span className="font-mono text-[8px] text-lime-accent uppercase">Verified</span>
          </div>
        </div>
        <h3 className="font-display text-xl font-black truncate text-white uppercase italic leading-none group-hover:text-lime-accent transition-colors">
          {analysis.detected.productName}
        </h3>
        <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-2">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-gray-600 uppercase">Verdict</span>
            <span className={`text-[10px] font-bold uppercase ${
              analysis.marketComparison.verdict === 'bad' ? 'text-red-500' : 
              analysis.marketComparison.verdict === 'good' ? 'text-lime-accent' : 'text-yellow-500'
            }`}>
              {analysis.marketComparison.verdict}
            </span>
          </div>
          <div className="px-2 py-1 border border-white/10 font-mono text-[8px] text-gray-400 uppercase">
            {analysis.detected.category}
          </div>
        </div>
      </div>
      {/* Aesthetic Cyber Decor */}
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-transparent group-hover:border-lime-accent transition-colors" />
    </motion.div>
  );
}