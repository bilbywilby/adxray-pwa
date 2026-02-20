import React, { useRef, useState, useEffect } from 'react';
import { Camera, FlipHorizontal, X, Image as ImageIcon } from 'lucide-react';
interface AdScannerProps {
  onCapture: (b64: string) => void;
  onBack: () => void;
}
export function AdScanner({ onCapture, onBack }: AdScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasCamera, setHasCamera] = useState(true);
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode, width: { ideal: 1080 }, height: { ideal: 1920 } }
        });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera Error:", err);
        setHasCamera(false);
      }
    }
    startCamera();
    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [facingMode]);
  const captureFrame = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    const b64 = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    onCapture(b64);
  };
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const b64 = (reader.result as string).split(',')[1];
        onCapture(b64);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="relative h-full flex flex-col bg-black">
      <div className="absolute top-6 left-6 right-6 flex justify-between z-10">
        <button onClick={onBack} className="p-2 bg-black/50 rounded-full border border-white/10"><X /></button>
        <button onClick={() => setFacingMode(f => f === 'user' ? 'environment' : 'user')} className="p-2 bg-black/50 rounded-full border border-white/10"><FlipHorizontal /></button>
      </div>
      <div className="relative flex-1 bg-black flex items-center justify-center">
        {hasCamera ? (
          <>
            <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-lime-accent/40 rounded-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-0.5 bg-lime-accent/20 animate-scan-line" />
            </div>
          </>
        ) : (
          <div className="p-8 text-center space-y-4">
            <ImageIcon className="w-12 h-12 mx-auto text-gray-600" />
            <p className="text-gray-400 font-mono text-xs">NO CAMERA STREAM DETECTED</p>
            <label className="block w-full py-4 bg-[#1a1a1a] border border-[#333] cursor-pointer">
              <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
              UPLOAD FROM STORAGE
            </label>
          </div>
        )}
      </div>
      <div className="h-32 bg-black flex items-center justify-around px-8">
        <label className="cursor-pointer">
          <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          <ImageIcon className="text-white/50" />
        </label>
        <button onClick={captureFrame} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-transform">
          <div className="w-16 h-16 rounded-full bg-lime-accent" />
        </button>
        <div className="w-6" />
      </div>
    </div>
  );
}