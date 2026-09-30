import { describe, expect, it } from 'vitest';
import {
  equipmentLabel,
  exerciseAttribution,
  hasVideoReference,
  safeVideoUrl,
  submitterReference,
} from './exerciseDisplay';

describe('exercise display — video links', () => {
  it('keeps a well-formed web link', () => {
    expect(safeVideoUrl('https://www.youtube.com/watch?v=wm47Swzn_98')).toBe(
      'https://www.youtube.com/watch?v=wm47Swzn_98'
    );
  });

  it('treats a missing, malformed or non-web reference as unavailable', () => {
    expect(safeVideoUrl(null)).toBeNull();
    expect(safeVideoUrl('')).toBeNull();
    expect(safeVideoUrl('/videos/old.mp4')).toBeNull();
    expect(safeVideoUrl('javascript:alert(1)')).toBeNull();
  });

  it('knows whether a video reference is stored at all', () => {
    expect(hasVideoReference({ videoUrl: null })).toBe(false);
    expect(hasVideoReference({ videoUrl: 'broken' })).toBe(true);
  });
});

describe('exercise display — attribution', () => {
  it('credits the source and license of an imported exercise (US-005.AC-2)', () => {
    expect(
      exerciseAttribution({
        sourceAttribution: 'exercemus/exercises (wger.de)',
        sourceLicense: 'CC-BY-SA 3.0',
      })
    ).toBe('Fonte: exercemus/exercises (wger.de) · Licença CC-BY-SA 3.0');
  });

  it('credits the source alone when no license is stored', () => {
    expect(
      exerciseAttribution({ sourceAttribution: 'wger', sourceLicense: null })
    ).toBe('Fonte: wger');
  });

  it('shows no credit for an in-house exercise (US-005.EC-1)', () => {
    expect(
      exerciseAttribution({ sourceAttribution: null, sourceLicense: null })
    ).toBeNull();
  });
});

describe('exercise display — labels', () => {
  it('names each equipment value in Portuguese', () => {
    expect(equipmentLabel('GYM')).toBe('Academia');
    expect(equipmentLabel('HOME_BASIC')).toBe('Casa com equipamento básico');
    expect(equipmentLabel('BODYWEIGHT')).toBe('Só peso corporal');
  });

  it('refers to a submitter by a short id, never more', () => {
    expect(submitterReference('0190aaaa-bbbb-7ccc-8ddd-eeeeffff0000')).toBe(
      'Educador 0190aaaa'
    );
    expect(submitterReference(null)).toBe('Desconhecido');
  });
});
