import React, { useRef, useState, useEffect } from 'react';
import { Camera, FlipHorizontal, X, Image as ImageIcon, Zap } from 'lucide-react';
import { resizeImage } from '@/lib/ad-utils';
import { useAdXRayStore } from '@/lib/ad-analysis-store';
interface AdScannerProps {
  onCapture: (b64: string) => void;
  onBack: () => void;
}
export function AdScanner({ onCapture, onBack }: AdScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasCamera, setHasCamera] = useState(true);
  const setError = useAdXRayStore(s => s.setError);
  useEffect(() => {
    let stream: MediaStream | null = null;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setHasCamera(false);
      }
    }
    startCamera();
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [facingMode]);
  const captureFrame = async () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const rawB64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    const optimizedB64 = await resizeImage(rawB64);
    onCapture(optimizedB64);
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const rawB64 = (reader.result as string).split(',')[1];
      const optimizedB64 = await resizeImage(rawB64);
      onCapture(optimizedB64);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-6 left-6 right-6 flex justify-between z-10">
        <button onClick={onBack} className="p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/20 text-white">
          <X size={24} />
        </button>
        <button onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')} className="p-3 bg-black/50 backdrop-blur-md rounded-full border border-white/20 text-white">
          <FlipHorizontal size={24} />
        </button>
      </div>
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        {hasCamera ? (
          <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
        ) : (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto">
              <ImageIcon className="text-gray-500" size={32} />
            </div>
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest">Camera access restricted</p>
          </div>
        )}
        <div className="absolute inset-0 border-[20px] border-black/40 pointer-events-none" />
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-lime-accent/30 shadow-[0_0_15px_rgba(200,241,53,0.5)] animate-scan-line" />
      </div>
      <div className="h-40 bg-black flex items-center justify-between px-10 border-t border-white/10">
        <label className="cursor-pointer p-4 hover:bg-white/5 rounded-full transition-colors">
          <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          <ImageIcon className="text-white/70" size={28} />
        </label>
        <button onClick={captureFrame} className="group relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-white rounded-full scale-110 group-active:scale-95 transition-transform" />
          <div className="w-16 h-16 bg-lime-accent rounded-full shadow-[0_0_20px_rgba(200,241,53,0.4)]" />
        </button>
        <div className="p-4 opacity-50">
          <Zap className="text-white" size={28} />
        </div>
      </div>
    </div>
  );
}