import React from 'react';
import { ExtractionRecord } from '@/lib/history-store';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FileText, Cpu, Hash } from 'lucide-react';
interface HistoryCardProps {
  record: ExtractionRecord;
  onClick: (record: ExtractionRecord) => void;
}
export function HistoryCard({ record, onClick }: HistoryCardProps) {
  const fieldCount = Object.keys(record.structuredData).length;
  const hexLabel = record.id.slice(0, 6).toUpperCase();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: '#c8f135' }}
      onClick={() => onClick(record)}
      className="cursor-pointer bg-[#111] p-4 border-2 border-[#222] transition-all relative group overflow-hidden"
    >
      {/* Document Identity Block */}
      <div className="aspect-video w-full bg-[#0a0a0a] border border-[#222] flex flex-col items-center justify-center relative mb-4">
        <FileText className="w-12 h-12 text-gray-700 group-hover:text-primary/50 transition-colors" />
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <Hash className="w-3 h-3 text-gray-800" />
          <span className="font-mono text-[8px] text-gray-700 uppercase">{hexLabel}</span>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <Cpu className="w-3 h-3 text-primary/30" />
          <span className="font-mono text-[8px] text-primary/30 uppercase">Neural_Parsed</span>
        </div>
      </div>
      <div className="space-y-2 px-1">
        <div className="flex justify-between items-center">
          <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
            {format(record.timestamp, 'MMM d, HH:mm')}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_#c8f135]" />
            <span className="font-mono text-[8px] text-primary uppercase">Stored</span>
          </div>
        </div>
        <h3 className="font-display text-xl font-black truncate text-white uppercase italic leading-none group-hover:text-primary transition-colors">
          {record.fileName}
        </h3>
        <div className="flex items-center justify-between border-t border-[#222] pt-2 mt-2">
          <div className="flex flex-col">
            <span className="text-[8px] font-mono text-gray-600 uppercase">Field Density</span>
            <span className="text-[10px] font-bold text-gray-400">{fieldCount} Points Extracted</span>
          </div>
          <div className="w-8 h-8 rounded-none border border-[#222] flex items-center justify-center text-[10px] font-mono text-gray-500 group-hover:border-primary/50 transition-colors">
            {record.fileSize ? `${Math.round(record.fileSize / 1024)}K` : 'PDF'}
          </div>
        </div>
      </div>
      {/* Cyber Corner Decor */}
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-transparent group-hover:border-primary transition-colors" />
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}