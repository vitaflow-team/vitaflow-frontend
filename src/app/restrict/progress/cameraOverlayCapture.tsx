'use client';

import { Button } from '@/_components/ui/button';
import { useEffect, useRef, useState } from 'react';

interface CameraOverlayCaptureProps {
  previousPhotoUrl?: string;
  onCapture: (file: File) => void;
}

// Live camera view with the previous photo for this angle shown translucent
// on top (ADR-004), so the user can match framing before the shutter. Where
// the browser/device context doesn't support a live camera (no
// `getUserMedia`, permission denied, no camera present), falls back to a
// plain `<input type="file">` picker — the feature never becomes fully
// unusable for a missing overlay capability (US-002.EC-1).
export function CameraOverlayCapture({
  previousPhotoUrl,
  onCapture,
}: CameraOverlayCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraUnavailable, setCameraUnavailable] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function startCamera() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraUnavailable(true);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraReady(true);
      } catch {
        setCameraUnavailable(true);
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (!blob) return;
      onCapture(new File([blob], 'progress-photo.png', { type: 'image/png' }));
    }, 'image/png');
  }

  function handleFilePicked(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (file) onCapture(file);
  }

  if (cameraUnavailable) {
    return (
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Não foi possível acessar a câmera neste dispositivo. Escolha uma foto
          da sua galeria.
        </p>
        <Button onClick={() => fileInputRef.current?.click()}>
          Escolher foto
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFilePicked}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative aspect-3/4 w-full max-w-sm overflow-hidden rounded-lg bg-muted">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="h-full w-full object-cover"
        />
        {previousPhotoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previousPhotoUrl}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
          />
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <Button onClick={capture} disabled={!cameraReady}>
        Capturar foto
      </Button>
    </div>
  );
}
