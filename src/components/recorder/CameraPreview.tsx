"use client";

import { useEffect, useRef } from "react";

interface CameraPreviewProps {
  stream: MediaStream | null;
  mirrored?: boolean;
}

export function CameraPreview({ stream, mirrored = true }: CameraPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative w-full aspect-video bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 shadow-warm">
      {stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full h-full object-cover ${mirrored ? "-scale-x-100" : ""}`}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
          <svg className="w-10 h-10 mb-3 text-stone-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-stone-500">Camera preview</p>
          <p className="text-xs text-stone-400 mt-1">Enable camera to get started</p>
        </div>
      )}
    </div>
  );
}
