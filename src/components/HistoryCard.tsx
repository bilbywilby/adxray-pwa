import React from 'react';
import { ScanRecord } from '@/lib/history-store';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
interface HistoryCardProps {
  scan: ScanRecord;
  onClick: (scan: ScanRecord) => void;
}
export function HistoryCard({ scan, onClick }: HistoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, borderColor: '#c8f135' }}
      onClick={() => onClick(scan)}
      className="cursor-pointer bg-[#111] p-2 border-2 border-[#222] transition-colors relative group"
    >
      <div className="aspect-square w-full bg-[#0a0a0a] border border-[#222] overflow-hidden relative">
        <img
          src={scan.imagePreview}
          alt="Ad Scan"
          className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
        />
        <div className="absolute inset-0 bg-lime-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="mt-3 flex justify-between items-center px-1">
        <span className="font-condensed text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          {format(scan.timestamp, 'MMM d, HH:mm')}
        </span>
        <div className="w-1 h-1 bg-lime-accent" />
      </div>
      <div className="mt-1 px-1">
        <p className="font-condensed text-xs font-black truncate text-white uppercase tracking-tighter">
          {scan.analysis.detected.productName}
        </p>
      </div>
      {/* Cyber Corner Decor */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-lime-accent/0 group-hover:border-lime-accent/50 transition-colors" />
    </motion.div>
  );
}