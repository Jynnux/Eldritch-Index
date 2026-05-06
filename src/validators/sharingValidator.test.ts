import { describe, expect, it } from '@jest/globals';
import { ShareCharacterSchema } from './sharingValidator.js';
// -- GABRIELLE TAUNTON --
// THIRD UNIT TEST: shareValidator.test.ts
// Pasting some explanations over for each segment (don't mind the repeats) so I can better remember
// it for making the others. Describe: When you have several tests for one thing, group them.
// Additional comment -- more or less simple for this one, picked this for time's sake.
describe('sharing character schema test', (): void => {
  it('valid input test', (): void => {
    expect(ShareCharacterSchema.safeParse({ targetUserDisplayName: 'Jaundice' }).success).toBe(
      true,
    );
  });
  it('whitespace/invalid input test', (): void => {
    expect(ShareCharacterSchema.safeParse({ targetUserDisplayName: '' }).success).toBe(false);
  });
});
