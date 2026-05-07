// TESTS DONE BY JUSTIN COATS

import { ItemSchema } from './itemValidator';

describe('ItemSchema validation', () => {
  it('accepts valid item input', () => {
    const result = ItemSchema.safeParse({
      name: 'Sword of Truth',
      description: 'A legendary blade forged in ancient fire.',
    });

    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = ItemSchema.safeParse({
      name: '',
      description: 'Valid description',
    });

    expect(result.success).toBe(false);
  });

  it('rejects empty description', () => {
    const result = ItemSchema.safeParse({
      name: 'Valid Name',
      description: '',
    });

    expect(result.success).toBe(false);
  });

  it('rejects name longer than 255 characters', () => {
    const result = ItemSchema.safeParse({
      name: 'a'.repeat(256),
      description: 'Valid description',
    });

    expect(result.success).toBe(false);
  });

  it('rejects description longer than 1024 characters', () => {
    const result = ItemSchema.safeParse({
      name: 'Valid Name',
      description: 'a'.repeat(1025),
    });

    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const result = ItemSchema.safeParse({
      name: 'Only name provided',
    });

    expect(result.success).toBe(false);
  });
});
