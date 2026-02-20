import React from 'react';
import { ScanRecord } from '@/lib/history-store';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
interface HistoryCardProps {
  scan: ScanRecord;
  onClick: (scan: ScanRecord) => void;
}
export function HistoryCard({ scan, onClick }: HistoryCardProps) {
  // Random rotation between -2 and 2 degrees for that "scattered photos" look
  const rotation = React.useMemo(() => (Math.random() * 4 - 2), []);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      onClick={() => onClick(scan)}
      className="cursor-pointer bg-[#FDFBF7] p-3 pb-10 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group"
    >
      <div className="aspect-square w-full bg-gray-200 border border-black/10 overflow-hidden relative">
        <img 
          src={scan.imagePreview} 
          alt="Ad Scan" 
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" 
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>
      <div className="absolute bottom-2 left-0 right-0 text-center">
        <span className="font-sketch text-sm font-bold opacity-70">
          {format(scan.timestamp, 'MMM d, HH:mm')}
        </span>
      </div>
      {/* Tape effect */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-4 bg-white/60 border border-black/5 -rotate-2" />
    </motion.div>
  );
}