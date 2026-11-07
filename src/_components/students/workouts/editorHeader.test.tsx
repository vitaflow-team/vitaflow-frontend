import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EditorHeader } from './editorHeader';

describe('EditorHeader — pdf-export US-004', () => {
  it('UT-038 renders an Exportar PDF link for the educator-authored workout', () => {
    const html = renderToStaticMarkup(
      <EditorHeader
        studentId="student-1"
        workoutId="workout-1"
        status="ACTIVE"
        isGone={false}
      />
    );

    expect(html).toContain(
      'href="/api/educator/students/student-1/workouts/workout-1/pdf"'
    );
    expect(html).toContain('Exportar PDF');
  });
});
