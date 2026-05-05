import { StatSchema } from './statValidator.js';
// -- GABRIELLE TAUNTON --
// SECOND UNIT TEST: statValidator.test.ts
// Pasting some explanations over for each segment so I can better remember it for making the
// others. Describe: When you have several tests for one thing, group them. Nesting.
// Additional comment:
// Tested for valid inputs solely given the nature of enum -- couldn't do toThrow().
describe('stat method picker', (): void => {
  it('picking point buy method', (): void => {
    // .toBe is for primitive equality,  .toequal for objects and arrays. .toequalhere
    // as statValidator is an object, tested with toEqual.
    expect(StatSchema.parse({ method: 'point-buy' })).toEqual({ method: 'point-buy' });
  });
  it('rolling method picked', (): void => {
    expect(StatSchema.parse({ method: 'rolling' })).toEqual({ method: 'rolling' });
  });
  it('whitespacing wrong input', (): void => {
    expect(StatSchema.safeParse({ method: '  ' }).success).toBe(false);
  });
});
