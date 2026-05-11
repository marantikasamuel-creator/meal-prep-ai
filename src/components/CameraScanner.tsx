import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, RefreshCcw, Check, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface CameraScannerProps {
  onCapture: (base64Image: string) => void;
  onClose: () => void;
}

export function CameraScanner({ onCapture, onClose }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Gagal mengakses kamera. Pastikan lo udah kasih izin kamera ya!");
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
        setCapturedImage(canvas.toDataURL('image/jpeg', 0.8));
      }
    }
  };

  const confirmCapture = () => {
    if (capturedImage) {
      const parts = capturedImage.split(',');
      if (parts.length === 2) {
         onCapture(parts[1]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900 flex flex-col">
      <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-stone-900/80 to-transparent">
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-stone-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-stone-700 transition"
        >
          <X size={20} />
        </button>
        <span className="text-white font-bold tracking-widest text-xs uppercase flex items-center gap-1">
          <Sparkles size={14} className="text-emerald-400" />
          Scan Bahan
        </span>
        {!capturedImage && (
          <button 
            onClick={toggleCamera}
            className="w-10 h-10 bg-stone-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-stone-700 transition"
          >
            <RefreshCcw size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 relative bg-black overflow-hidden flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-400 text-center p-6 text-sm font-medium">
            {error}
          </div>
        )}

        {capturedImage ? (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />

        {!capturedImage && !error && (
            <div className="absolute inset-0 pointer-events-none p-12 flex items-center justify-center">
               <div className="w-full max-w-sm aspect-square border-2 border-white/30 rounded-[40px] relative">
                  <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-emerald-500 rounded-tl-[40px]"></div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-emerald-500 rounded-tr-[40px]"></div>
                  <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-emerald-500 rounded-bl-[40px]"></div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-emerald-500 rounded-br-[40px]"></div>
               </div>
            </div>
        )}
      </div>

      <div className="p-8 bg-stone-900 pb-12 flex justify-center items-center">
        <AnimatePresence mode="wait">
          {!capturedImage ? (
            <motion.div
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <button 
                onClick={handleCapture}
                disabled={isLoading || !!error}
                className="w-20 h-20 bg-emerald-500 hover:bg-emerald-600 rounded-full border-4 border-stone-800 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_0_4px_rgba(16,185,129,0.3)] active:scale-95"
              >
                <Camera size={32} className="text-white" />
              </button>
              <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">Foto Bahan Lo</span>
            </motion.div>
          ) : (
            <motion.div
               layout
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 20, opacity: 0 }}
               className="flex w-full max-w-sm gap-4"
            >
               <button 
                 onClick={() => setCapturedImage(null)}
                 className="flex-1 py-4 bg-stone-800 hover:bg-stone-700 text-white rounded-2xl font-bold transition-all text-sm uppercase tracking-widest"
               >
                 Ulangi
               </button>
               <button 
                 onClick={confirmCapture}
                 className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black transition-all text-sm uppercase tracking-widest flex items-center justify-center gap-2"
               >
                 <Check size={18} /> Pakai Foto
               </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
