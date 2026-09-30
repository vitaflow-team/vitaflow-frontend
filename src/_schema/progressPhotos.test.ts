import { describe, expect, it } from 'vitest';
import {
  deletePhotoSchema,
  photoAngleSchema,
  uploadPhotoSchema,
} from './progressPhotos';

function makeFile(overrides: Partial<{ type: string; size: number }> = {}) {
  const size = overrides.size ?? 1024;
  return new File([new Uint8Array(size)], 'photo.png', {
    type: overrides.type ?? 'image/png',
  });
}

describe('photoAngleSchema', () => {
  it('accepts every valid angle', () => {
    expect(photoAngleSchema.safeParse('FRONT').success).toBe(true);
    expect(photoAngleSchema.safeParse('SIDE').success).toBe(true);
    expect(photoAngleSchema.safeParse('BACK').success).toBe(true);
  });

  it('rejects an unknown angle', () => {
    expect(photoAngleSchema.safeParse('UP').success).toBe(false);
  });
});

describe('uploadPhotoSchema', () => {
  it('accepts a valid angle and image file', () => {
    const result = uploadPhotoSchema.safeParse({
      angle: 'FRONT',
      file: makeFile(),
    });
    expect(result.success).toBe(true);
  });

  it('rejects a non-image mime type', () => {
    const result = uploadPhotoSchema.safeParse({
      angle: 'FRONT',
      file: makeFile({ type: 'text/plain' }),
    });
    expect(result.success).toBe(false);
  });

  it('rejects a file over 8MB', () => {
    const result = uploadPhotoSchema.safeParse({
      angle: 'FRONT',
      file: makeFile({ size: 9 * 1024 * 1024 }),
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid angle', () => {
    const result = uploadPhotoSchema.safeParse({
      angle: 'DIAGONAL',
      file: makeFile(),
    });
    expect(result.success).toBe(false);
  });
});

describe('deletePhotoSchema', () => {
  it('accepts a valid uuid', () => {
    expect(
      deletePhotoSchema.safeParse({
        photoId: '019bba14-b92d-7361-83d5-ba328169c414',
      }).success
    ).toBe(true);
  });

  it('rejects a non-uuid value', () => {
    expect(deletePhotoSchema.safeParse({ photoId: 'not-a-uuid' }).success).toBe(
      false
    );
  });
});
