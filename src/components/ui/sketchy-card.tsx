import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
interface SketchyCardProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'default' | 'yellow' | 'pink' | 'cyan';
  className?: string;
  delay?: number;
}
const variants = {
  default: 'bg-[#FDFBF7]',
  yellow: 'bg-[#FFD23F]',
  pink: 'bg-[#FF70A6]',
  cyan: 'bg-[#70D6FF]',
};
export function SketchyCard({ children, title, variant = 'default', className, delay = 0 }: SketchyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: -1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ delay, duration: 0.4, type: 'spring' }}
      whileHover={{ rotate: 1, scale: 1.01 }}
      className={cn(
        "relative p-6 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-transform",
        variants[variant],
        className
      )}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold uppercase tracking-tight border-b-2 border-black pb-1 inline-block">
            {title}
          </h3>
        </div>
      )}
      <div className="font-medium leading-relaxed">
        {children}
      </div>
      {/* Decorative "Tape" effect */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 border border-black/10 rotate-1 pointer-events-none" />
    </motion.div>
  );
}