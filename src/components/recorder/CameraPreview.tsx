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
    <div className="relative w-full aspect-video bg-stone-100 rounded-3xl overflow-hidden border border-stone-200 shadow-warm">
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
          <span className="text-5xl mb-3">🎥</span>
          <p className="text-sm text-stone-500">Camera preview</p>
          <p className="text-xs text-stone-400 mt-1">Enable camera to get started</p>
        </div>
      )}
    </div>
  );
}
