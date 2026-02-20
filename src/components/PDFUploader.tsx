import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, Cpu } from 'lucide-react';
import { useExtractionStore } from '@/lib/extraction-store';
import { usePDFExtraction } from '@/hooks/use-pdf-extraction';
import { cn } from '@/lib/utils';
export function PDFUploader() {
  const status = useExtractionStore(s => s.status);
  const currentFile = useExtractionStore(s => s.currentFile);
  const { processFile } = usePDFExtraction();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  }, [processFile]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: status !== 'idle' && status !== 'error' && status !== 'completed'
  });
  const isProcessing = status !== 'idle' && status !== 'completed' && status !== 'error';
  return (
    <div 
      {...getRootProps()} 
      className={cn(
        "relative w-full aspect-[16/6] min-h-[240px] border-2 border-dashed border-[#333] bg-[#0d0d0d] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group",
        isDragActive && "border-primary bg-primary/5",
        isProcessing && "cursor-wait border-primary/50"
      )}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="flex flex-col items-center space-y-6 z-10">
          <div className="relative">
            <Cpu className="w-12 h-12 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse" />
          </div>
          <div className="text-center">
            <h4 className="font-display text-2xl font-black text-primary tracking-widest uppercase italic">Analyzing Matrix</h4>
            <p className="font-mono text-[10px] text-gray-500 uppercase mt-1">Status: {status}...</p>
          </div>
          {/* Scan line animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-1 bg-primary/20 shadow-[0_0_15px_rgba(200,241,53,0.5)] animate-scan-line" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 px-6 text-center z-10">
          <div className="p-4 bg-[#1a1a1a] border border-[#333] group-hover:border-primary transition-colors">
            {currentFile ? <FileText className="w-8 h-8 text-primary" /> : <Upload className="w-8 h-8 text-gray-600" />}
          </div>
          <div>
            <h4 className="font-display text-2xl font-black text-white uppercase italic">
              {currentFile || "Load Intelligence Source"}
            </h4>
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mt-1">
              {isDragActive ? "Release to Initiate" : "Drop PDF or Click to Browse"}
            </p>
          </div>
        </div>
      )}
      {/* Background Decor */}
      <div className="absolute top-2 left-2 font-mono text-[8px] text-gray-800 uppercase">Input_Terminal_v4.2</div>
      <div className="absolute bottom-2 right-2 flex gap-2">
        <div className="w-1 h-1 bg-[#333]" />
        <div className="w-1 h-1 bg-[#333]" />
      </div>
    </div>
  );
}