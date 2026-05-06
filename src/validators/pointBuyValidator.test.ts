import { describe, expect, it } from '@jest/globals';
import { PointSchema } from './pointBuyValidator.js';
// -- GABRIELLE TAUNTON --
// FIRST UNIT TEST: POINTBUYVALIDATOR.TEST.TS
// Pasting some explanations over for each segment so I can better remember it for making the
// others. Describe: When you have several tests for one thing, group them. Nesting.
describe('point buy validator test', (): void => {
  // it and test does the same thing. We use 'it' inside describe blocks.
  it('accepts valid point-buy input', () => {
    const data = {
      numstr: 50,
      numcon: 50,
      numdex: 50,
      numapp: 50,
      numedu: 50,
      numsiz: 50,
      numint: 50,
      numpow: 50,
    };
    // You pass a function to expect, we let Jest know what to expect out of testing.
    // .toBe is for primitive equality,  .toequal for objects and arrays
    expect(PointSchema.safeParse(data).success).toBe(true);
  });

  it('reject if num<15', (): void => {
    const data = {
      numstr: -10,
      numcon: 50,
      numdex: 50,
      numapp: 50,
      numedu: 50,
      numsiz: 50,
      numint: 50,
      numpow: 50,
    };
    expect(PointSchema.safeParse(data).success).toBe(false);
  });

  it('reject if num>90', (): void => {
    const data = {
      numstr: 95,
      numcon: 50,
      numdex: 50,
      numapp: 50,
      numedu: 50,
      numsiz: 50,
      numint: 50,
      numpow: 50,
    };
    expect(PointSchema.safeParse(data).success).toBe(false);
  });
  // Similar to the example, going outside bounds to ensure it passes too.
  it('rejects if outside boundaries/whitespaced', (): void => {
    const data = {
      numstr: 50,
      numcon: ' ',
      numdex: 50,
      numapp: 50,
      numedu: 50,
      numsiz: 50,
      numint: 50,
      numpow: 50,
    };
    expect(PointSchema.safeParse(data).success).toBe(false);
  });
});
