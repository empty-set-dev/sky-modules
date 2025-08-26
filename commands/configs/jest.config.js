import fs from 'fs'
import path from 'path'

import { pathsToModuleNameMapper } from 'ts-jest'

let tsconfigDir = path.dirname(process.argv[2])

while (!fs.existsSync(`${tsconfigDir}/tsconfig.json`)) {
    if (tsconfigDir === '') {
        // eslint-disable-next-line no-console
        console.error('tsconfig.json not found')
    }
    tsconfigDir = path.dirname(tsconfigDir)
}

const { compilerOptions } = JSON.parse(fs.readFileSync(`${tsconfigDir}/tsconfig.json`, 'utf-8'))

export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
    modulePaths: ['<rootDir>'],
    coverageDirectory: './coverage',
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
    testRegex: '.*\\.test\\.ts$',
    transform: { '^.+\\.(t|j)s$': 'ts-jest' },
    collectCoverageFrom: ['**/*.(t|j)s'],
}
