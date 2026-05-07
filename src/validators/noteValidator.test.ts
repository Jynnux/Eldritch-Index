// TESTS DONE BY JUSTIN COATS

import { NoteSchema } from './noteValidator';

describe('NoteSchema validation', () => {
  it('accepts valid note content', () => {
    const result = NoteSchema.safeParse({
      content: 'This is a valid note.',
    });

    expect(result.success).toBe(true);
  });

  it('accepts empty string content (min(0))', () => {
    const result = NoteSchema.safeParse({
      content: '',
    });

    expect(result.success).toBe(true);
  });

  it('rejects content longer than 2048 characters', () => {
    const result = NoteSchema.safeParse({
      content: 'a'.repeat(2049),
    });

    expect(result.success).toBe(false);
  });

  it('rejects missing content field', () => {
    const result = NoteSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it('rejects non-string content', () => {
    const result = NoteSchema.safeParse({
      content: 12345,
    });

    expect(result.success).toBe(false);
  });
});
