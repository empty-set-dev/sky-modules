export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePaths: ['<rootDir>'],
    coverageDirectory: './coverage',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    testRegex: '.*\\.test\\.ts$',
    // transform: { '^.+\\.(t|j)s$': 'ts-jest' },
    collectCoverageFrom: ['**/*.(t|j)s'],
}
