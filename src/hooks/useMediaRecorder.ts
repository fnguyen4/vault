"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type RecorderStatus =
  | "idle"
  | "requesting"
  | "ready"
  | "recording"
  | "stopped"
  | "error";

interface MediaRecorderState {
  status: RecorderStatus;
  stream: MediaStream | null;
  recordedBlob: Blob | null;
  durationSeconds: number;
  error: string | null;
}

interface MediaRecorderActions {
  requestCamera: () => Promise<void>;
  startRecording: () => void;
  stopRecording: () => void;
  retake: () => void;
  cleanup: () => void;
}

function getSupportedMimeType(): string {
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
    "",
  ];
  for (const type of types) {
    if (!type || MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

export function useMediaRecorder(): MediaRecorderState & MediaRecorderActions {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [durationSeconds, setDurationSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const requestCamera = useCallback(async () => {
    setStatus("requesting");
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      setStream(s);
      setStatus("ready");
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Camera access denied";
      setError(msg);
      setStatus("error");
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!stream) return;
    chunksRef.current = [];
    const mimeType = getSupportedMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, {
        type: mimeType || "video/webm",
      });
      setRecordedBlob(blob);
      setStatus("stopped");
      stopTimer();
    };

    recorder.start(100);
    setDurationSeconds(0);
    setStatus("recording");

    timerRef.current = setInterval(() => {
      setDurationSeconds((d) => d + 1);
    }, 1000);
  }, [stream, stopTimer]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    stopTimer();
  }, [stopTimer]);

  const retake = useCallback(() => {
    setRecordedBlob(null);
    setDurationSeconds(0);
    setStatus("ready");
  }, []);

  const cleanup = useCallback(() => {
    stopTimer();
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setStatus("idle");
    setRecordedBlob(null);
    setDurationSeconds(0);
  }, [stream, stopTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  return {
    status,
    stream,
    recordedBlob,
    durationSeconds,
    error,
    requestCamera,
    startRecording,
    stopRecording,
    retake,
    cleanup,
  };
}
