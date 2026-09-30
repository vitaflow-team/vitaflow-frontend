import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CatalogAttribution } from './catalogAttribution';
import { ExerciseDetail } from './exerciseDetail';
import { exerciseFixture } from './exerciseFixture';

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

function render(overrides: Parameters<typeof exerciseFixture>[0] = {}) {
  return renderToStaticMarkup(
    <ExerciseDetail exercise={exerciseFixture(overrides)} />
  );
}

describe('exercise detail', () => {
  it('shows description, equipment and muscles (US-004.AC-4)', () => {
    const body = text(render());

    expect(body).toContain('Supino reto');
    expect(body).toContain('Deitado no banco, empurre a barra.');
    expect(body).toContain('Equipamento Academia');
    expect(body).toContain('Grupo muscular Peito');
    expect(body).toContain('Músculos secundários Tríceps');
  });

  it('offers "Ver vídeo" when there is a video (US-004.AC-1)', () => {
    const html = render({ videoUrl: 'https://www.youtube.com/watch?v=abc' });

    expect(text(html)).toContain('Ver vídeo');
    expect(html).toContain('href="https://www.youtube.com/watch?v=abc"');
  });

  it('renders without video or image, and with no error (US-004.AC-2, EC-1)', () => {
    const html = render({ videoUrl: null, imageUrl: null });

    expect(text(html)).not.toContain('Ver vídeo');
    expect(text(html)).not.toContain('indisponível');
    expect(html).not.toContain('<img');
    expect(text(html)).toContain('Deitado no banco');
  });

  it('shows the image when there is one', () => {
    const html = render({ imageUrl: 'https://cdn.example.com/supino.png' });

    expect(html).toContain('src="https://cdn.example.com/supino.png"');
    expect(html).toContain('alt="Demonstração de Supino reto"');
  });

  it('says a broken video reference is unavailable (US-004.EC-2)', () => {
    const html = render({ videoUrl: 'videos/missing.mp4' });

    expect(text(html)).toContain('Vídeo indisponível no momento.');
    expect(html).not.toContain('videos/missing.mp4');
  });

  it('shows an untranslated name as stored (US-004.AC-3)', () => {
    expect(text(render({ name: 'Bench Press' }))).toContain('Bench Press');
  });

  it('lists curated contraindications, or leaves the section out (US-004.AC-5)', () => {
    const withItems = text(
      render({ contraindications: ['SHOULDER', 'SPINE'] })
    );
    expect(withItems).toContain('Contraindicações');
    expect(withItems).toContain('Ombro');
    expect(withItems).toContain('Coluna');

    expect(text(render({ contraindications: [] }))).not.toContain(
      'Contraindicações'
    );
  });

  it('credits an imported exercise, not an in-house one (US-005)', () => {
    const imported = text(
      render({
        sourceAttribution: 'exercemus/exercises (wger.de)',
        sourceLicense: 'CC-BY-SA 3.0',
      })
    );
    expect(imported).toContain(
      'Fonte: exercemus/exercises (wger.de) · Licença CC-BY-SA 3.0'
    );

    expect(text(render())).not.toContain('Fonte:');
  });
});

describe('catalog attribution', () => {
  it('credits wger and exercemus/exercises under CC BY-SA (US-005.AC-1)', () => {
    const html = renderToStaticMarkup(<CatalogAttribution />);

    expect(html).toContain('href="https://wger.de"');
    expect(html).toContain('href="https://github.com/exercemus/exercises"');
    expect(text(html)).toContain('CC BY-SA 3.0');
  });
});
