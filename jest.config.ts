import type {Config} from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  preset: 'ts-jest',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', 
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};

export default config;