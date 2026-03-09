"use client";

import { useEffect, useRef } from "react";

interface VideoPlaybackProps {
  blob: Blob;
}

export function VideoPlayback({ blob }: VideoPlaybackProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const url = URL.createObjectURL(blob);
      videoRef.current.src = url;
      return () => URL.revokeObjectURL(url);
    }
  }, [blob]);

  return (
    <div className="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-700">
      <video
        ref={videoRef}
        controls
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
}
