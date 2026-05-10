import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  moduleNameMapper: {
    '^@ecommerce/database$': '<rootDir>/../../packages/database/src',
    '^@ecommerce/types$': '<rootDir>/../../packages/types/src',
  },
};

export default config;
