// -- GABRIELLE TAUNTON --
// Following slides for unit-testing here.
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest/presets/default-esm',  // TS + ES modules
  testEnvironment: 'node',                 // not a browser
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',          // resolve .js imports to .ts
  },
};

export default config;