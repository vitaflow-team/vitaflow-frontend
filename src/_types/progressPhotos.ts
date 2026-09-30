export type PhotoAngle = 'FRONT' | 'SIDE' | 'BACK';

export interface ProgressPhoto {
  id: string;
  angle: PhotoAngle;
  signedUrl: string;
  takenAt: string;
  // Present only right after uploading a second (or later) photo for the
  // same angle (IT-002) — the capture-guide overlay's source.
  previousPhotoUrl?: string;
}

export interface CompareResult {
  a: ProgressPhoto;
  b: ProgressPhoto;
}
