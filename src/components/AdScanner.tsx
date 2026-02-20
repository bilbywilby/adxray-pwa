import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload, Search, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resizeImage, extractTextFromImage } from '@/lib/ad-utils';
import { cn } from '@/lib/utils';
interface AdScannerProps {
  onScanComplete: (text: string) => void;
  isScanning: boolean;
}
export function AdScanner({ onScanComplete, isScanning }: AdScannerProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    try {
      const resized = await resizeImage(file);
      setPreview(resized);
      const text = await extractTextFromImage(resized, (p) => setProgress(Math.round(p * 100)));
      onScanComplete(text);
    } catch (err) {
      console.error(err);
    }
  }, [onScanComplete]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: isScanning
  });
  const clear = () => {
    setPreview(null);
    setProgress(0);
  };
  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "relative border-4 border-dashed border-black p-8 text-center cursor-pointer transition-all bg-white/50 hover:bg-white/80",
          isDragActive && "border-primary bg-primary/5",
          preview && "border-solid border-3 p-2"
        )}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative aspect-video w-full overflow-hidden border-2 border-black">
            <img src={preview} alt="Preview" className="w-full h-full object-contain" />
            <button 
              onClick={(e) => { e.stopPropagation(); clear(); }}
              className="absolute top-2 right-2 p-1 bg-black text-white rounded-none hover:bg-gray-800"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center gap-4">
            <div className="p-4 bg-[#FFD23F] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Camera size={48} />
            </div>
            <div>
              <p className="text-xl font-bold uppercase">Feed the X-Ray</p>
              <p className="text-muted-foreground">Drop ad screenshot or click to scan</p>
            </div>
          </div>
        )}
        {isScanning && (
          <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-6 z-10">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="text-lg font-bold uppercase tracking-widest">Developing Film...</p>
            <div className="w-full max-w-xs h-4 border-2 border-black mt-2 bg-gray-100 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs mt-2 font-mono">{progress}% Complete</p>
          </div>
        )}
      </div>
      <div className="flex gap-4 justify-center">
        <Button 
          variant="outline" 
          className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all uppercase font-bold"
          onClick={() => document.querySelector('input')?.click()}
        >
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
      </div>
    </div>
  );
}