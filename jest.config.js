import { pathsToModuleNameMapper } from 'ts-jest'

import { compilerOptions } from './tsconfig'

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    modulePaths: ['<rootDir>'],
    coverageDirectory: './coverage',
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    testRegex: '.*\\.test\\.ts$',
    transform: { '^.+\\.(t|j)s$': 'ts-jest' },
    collectCoverageFrom: ['**/*.(t|j)s'],
}
