/**
 * Tests for create command helpers
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from 'fs'
import path from 'path'
import { renameFile, copyBoilerplate, replaceInFile, extractModuleName } from './createHelpers'

describe('createHelpers', () => {
    const testRoot = path.join(process.cwd(), '.dev', 'test-create-helpers')
    const originalCwd = process.cwd()

    beforeEach(() => {
        // Clean up and create test directory
        if (existsSync(testRoot)) {
            rmSync(testRoot, { recursive: true, force: true })
        }
        mkdirSync(testRoot, { recursive: true })
    })

    afterEach(() => {
        // Clean up
        if (existsSync(testRoot)) {
            rmSync(testRoot, { recursive: true, force: true })
        }
    })

    describe('renameFile', () => {
        test('is exported as a function', () => {
            expect(typeof renameFile).toBe('function')
        })

        test('accepts two string parameters', () => {
            expect(renameFile.length).toBe(2)
        })
    })

    describe('replaceInFile', () => {
        test('is exported as a function', () => {
            expect(typeof replaceInFile).toBe('function')
        })

        test('accepts file path and replacements object', () => {
            expect(replaceInFile.length).toBe(2)
        })
    })

    describe('extractModuleName', () => {
        test('is exported from createHelpers', () => {
            expect(typeof extractModuleName).toBe('function')
        })

        test('extracts module name from Unix path', () => {
            expect(extractModuleName('src/components/Button')).toBe('Button')
        })

        test('extracts module name from Windows path', () => {
            expect(extractModuleName('src\\components\\Button')).toBe('Button')
        })

        test('extracts module name from nested path', () => {
            expect(extractModuleName('utils/helpers/format')).toBe('format')
        })

        test('handles single component', () => {
            expect(extractModuleName('Button')).toBe('Button')
        })

        test('handles empty string', () => {
            expect(extractModuleName('')).toBe('')
        })
    })

    describe('copyBoilerplate', () => {
        test('copies boilerplate directory to target', () => {
            // Create a mock boilerplate in cli/boilerplates
            const boilerplatesDir = path.join(originalCwd, 'cli', 'boilerplates')
            const testBoilerplate = path.join(boilerplatesDir, 'test-boilerplate')
            const targetPath = path.join(testRoot, 'target')

            // Create test boilerplate
            mkdirSync(testBoilerplate, { recursive: true })
            writeFileSync(path.join(testBoilerplate, 'file1.txt'), 'content1')
            writeFileSync(path.join(testBoilerplate, 'file2.txt'), 'content2')

            try {
                copyBoilerplate('test-boilerplate', targetPath)

                expect(existsSync(targetPath)).toBe(true)
                expect(existsSync(path.join(targetPath, 'file1.txt'))).toBe(true)
                expect(existsSync(path.join(targetPath, 'file2.txt'))).toBe(true)
                expect(readFileSync(path.join(targetPath, 'file1.txt'), 'utf-8')).toBe('content1')
                expect(readFileSync(path.join(targetPath, 'file2.txt'), 'utf-8')).toBe('content2')
            } finally {
                // Clean up test boilerplate
                if (existsSync(testBoilerplate)) {
                    rmSync(testBoilerplate, { recursive: true, force: true })
                }
            }
        })

        test('copies boilerplate with nested directories', () => {
            const boilerplatesDir = path.join(originalCwd, 'cli', 'boilerplates')
            const testBoilerplate = path.join(boilerplatesDir, 'test-nested')
            const targetPath = path.join(testRoot, 'target')

            // Create test boilerplate with nested structure
            mkdirSync(path.join(testBoilerplate, 'nested', 'deep'), { recursive: true })
            writeFileSync(path.join(testBoilerplate, 'root.txt'), 'root')
            writeFileSync(path.join(testBoilerplate, 'nested', 'nested.txt'), 'nested')
            writeFileSync(path.join(testBoilerplate, 'nested', 'deep', 'deep.txt'), 'deep')

            try {
                copyBoilerplate('test-nested', targetPath)

                expect(existsSync(path.join(targetPath, 'root.txt'))).toBe(true)
                expect(existsSync(path.join(targetPath, 'nested', 'nested.txt'))).toBe(true)
                expect(existsSync(path.join(targetPath, 'nested', 'deep', 'deep.txt'))).toBe(true)
                expect(readFileSync(path.join(targetPath, 'root.txt'), 'utf-8')).toBe('root')
                expect(readFileSync(path.join(targetPath, 'nested', 'nested.txt'), 'utf-8')).toBe(
                    'nested'
                )
                expect(
                    readFileSync(path.join(targetPath, 'nested', 'deep', 'deep.txt'), 'utf-8')
                ).toBe('deep')
            } finally {
                if (existsSync(testBoilerplate)) {
                    rmSync(testBoilerplate, { recursive: true, force: true })
                }
            }
        })

        test('preserves directory structure', () => {
            const boilerplatesDir = path.join(originalCwd, 'cli', 'boilerplates')
            const testBoilerplate = path.join(boilerplatesDir, 'test-structure')
            const targetPath = path.join(testRoot, 'target')

            // Create complex directory structure
            mkdirSync(path.join(testBoilerplate, 'src', 'components'), { recursive: true })
            mkdirSync(path.join(testBoilerplate, 'src', 'utils'), { recursive: true })
            mkdirSync(path.join(testBoilerplate, 'public'), { recursive: true })

            writeFileSync(path.join(testBoilerplate, 'README.md'), 'readme')
            writeFileSync(path.join(testBoilerplate, 'src', 'index.ts'), 'index')
            writeFileSync(path.join(testBoilerplate, 'src', 'components', 'Button.tsx'), 'button')
            writeFileSync(path.join(testBoilerplate, 'src', 'utils', 'helpers.ts'), 'helpers')
            writeFileSync(path.join(testBoilerplate, 'public', 'favicon.ico'), 'icon')

            try {
                copyBoilerplate('test-structure', targetPath)

                // Verify structure
                expect(existsSync(path.join(targetPath, 'README.md'))).toBe(true)
                expect(existsSync(path.join(targetPath, 'src', 'index.ts'))).toBe(true)
                expect(existsSync(path.join(targetPath, 'src', 'components', 'Button.tsx'))).toBe(
                    true
                )
                expect(existsSync(path.join(targetPath, 'src', 'utils', 'helpers.ts'))).toBe(true)
                expect(existsSync(path.join(targetPath, 'public', 'favicon.ico'))).toBe(true)
            } finally {
                if (existsSync(testBoilerplate)) {
                    rmSync(testBoilerplate, { recursive: true, force: true })
                }
            }
        })

        test('uses cliPath to resolve boilerplate directory', () => {
            const boilerplatesDir = path.join(originalCwd, 'cli', 'boilerplates')
            const testBoilerplate = path.join(boilerplatesDir, 'test-clipath')
            const targetPath = path.join(testRoot, 'target')

            mkdirSync(testBoilerplate, { recursive: true })
            writeFileSync(path.join(testBoilerplate, 'test.txt'), 'test')

            try {
                copyBoilerplate('test-clipath', targetPath)

                expect(existsSync(path.join(targetPath, 'test.txt'))).toBe(true)
            } finally {
                if (existsSync(testBoilerplate)) {
                    rmSync(testBoilerplate, { recursive: true, force: true })
                }
            }
        })

        test('preserves file contents when copying', () => {
            const boilerplatesDir = path.join(originalCwd, 'cli', 'boilerplates')
            const testBoilerplate = path.join(boilerplatesDir, 'test-content')
            const targetPath = path.join(testRoot, 'target')

            const testContent = 'This is test content\nWith multiple lines\nAnd special chars: \u{1F4A9}'

            mkdirSync(testBoilerplate, { recursive: true })
            writeFileSync(path.join(testBoilerplate, 'test.txt'), testContent, 'utf-8')

            try {
                copyBoilerplate('test-content', targetPath)

                const copiedContent = readFileSync(path.join(targetPath, 'test.txt'), 'utf-8')
                expect(copiedContent).toBe(testContent)
            } finally {
                if (existsSync(testBoilerplate)) {
                    rmSync(testBoilerplate, { recursive: true, force: true })
                }
            }
        })

        test('copies empty boilerplate directory', () => {
            const boilerplatesDir = path.join(originalCwd, 'cli', 'boilerplates')
            const testBoilerplate = path.join(boilerplatesDir, 'test-empty')
            const targetPath = path.join(testRoot, 'target')

            mkdirSync(testBoilerplate, { recursive: true })

            try {
                copyBoilerplate('test-empty', targetPath)

                expect(existsSync(targetPath)).toBe(true)
            } finally {
                if (existsSync(testBoilerplate)) {
                    rmSync(testBoilerplate, { recursive: true, force: true })
                }
            }
        })

        test('handles multiple file types', () => {
            const boilerplatesDir = path.join(originalCwd, 'cli', 'boilerplates')
            const testBoilerplate = path.join(boilerplatesDir, 'test-filetypes')
            const targetPath = path.join(testRoot, 'target')

            mkdirSync(testBoilerplate, { recursive: true })
            writeFileSync(path.join(testBoilerplate, 'file.ts'), 'typescript')
            writeFileSync(path.join(testBoilerplate, 'file.tsx'), 'tsx')
            writeFileSync(path.join(testBoilerplate, 'file.js'), 'javascript')
            writeFileSync(path.join(testBoilerplate, 'file.json'), '{"key":"value"}')
            writeFileSync(path.join(testBoilerplate, 'file.md'), '# Title')
            writeFileSync(path.join(testBoilerplate, 'file.css'), '.class {}')

            try {
                copyBoilerplate('test-filetypes', targetPath)

                expect(readFileSync(path.join(targetPath, 'file.ts'), 'utf-8')).toBe('typescript')
                expect(readFileSync(path.join(targetPath, 'file.tsx'), 'utf-8')).toBe('tsx')
                expect(readFileSync(path.join(targetPath, 'file.js'), 'utf-8')).toBe('javascript')
                expect(readFileSync(path.join(targetPath, 'file.json'), 'utf-8')).toBe(
                    '{"key":"value"}'
                )
                expect(readFileSync(path.join(targetPath, 'file.md'), 'utf-8')).toBe('# Title')
                expect(readFileSync(path.join(targetPath, 'file.css'), 'utf-8')).toBe('.class {}')
            } finally {
                if (existsSync(testBoilerplate)) {
                    rmSync(testBoilerplate, { recursive: true, force: true })
                }
            }
        })
    })
})
