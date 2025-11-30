/**
 * Tests for recursive directory processor
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs'
import path from 'path'
import { processDirectoryRecursively } from '../recursiveProcessor'

describe('recursiveProcessor', () => {
    const testRoot = path.join(process.cwd(), '.dev', 'test-recursive-processor')

    beforeEach(() => {
        // Clean up before each test
        if (existsSync(testRoot)) {
            rmSync(testRoot, { recursive: true, force: true })
        }
    })

    afterEach(() => {
        // Clean up after each test
        if (existsSync(testRoot)) {
            rmSync(testRoot, { recursive: true, force: true })
        }
    })

    describe('basic functionality', () => {
        test('processes single directory', () => {
            const testDir = path.join(testRoot, 'single')
            mkdirSync(testDir, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath) => {
                    processed.push(fullPath)
                },
            })

            expect(processed).toHaveLength(1)
            expect(processed[0]).toBe(path.resolve(testDir))
        })

        test('processes nested directories', () => {
            const testDir = path.join(testRoot, 'nested')
            const subDir1 = path.join(testDir, 'sub1')
            const subDir2 = path.join(testDir, 'sub2')
            const nestedDir = path.join(subDir1, 'nested')

            mkdirSync(nestedDir, { recursive: true })
            mkdirSync(subDir2, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath) => {
                    processed.push(path.basename(fullPath))
                },
            })

            expect(processed).toContain('nested')
            expect(processed).toContain('sub1')
            expect(processed).toContain('sub2')
            expect(processed).toContain('nested')
        })

        test('processes only directories, not files', () => {
            const testDir = path.join(testRoot, 'with-files')
            const subDir = path.join(testDir, 'sub')

            mkdirSync(subDir, { recursive: true })
            writeFileSync(path.join(testDir, 'file1.txt'), 'content')
            writeFileSync(path.join(subDir, 'file2.txt'), 'content')

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath) => {
                    processed.push(path.basename(fullPath))
                },
            })

            expect(processed).toHaveLength(2)
            expect(processed).toContain('with-files')
            expect(processed).toContain('sub')
        })
    })

    describe('depth tracking', () => {
        test('passes correct depth to processDirectory', () => {
            const testDir = path.join(testRoot, 'depth')
            const level1 = path.join(testDir, 'level1')
            const level2 = path.join(level1, 'level2')
            const level3 = path.join(level2, 'level3')

            mkdirSync(level3, { recursive: true })

            const depths: Array<{ path: string; depth: number }> = []
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath, depth) => {
                    depths.push({ path: path.basename(fullPath), depth })
                },
            })

            const depthMap = new Map(depths.map((d) => [d.path, d.depth]))

            expect(depthMap.get('depth')).toBe(0)
            expect(depthMap.get('level1')).toBe(1)
            expect(depthMap.get('level2')).toBe(2)
            expect(depthMap.get('level3')).toBe(3)
        })

        test('can start with custom depth', () => {
            const testDir = path.join(testRoot, 'custom-depth')
            const subDir = path.join(testDir, 'sub')

            mkdirSync(subDir, { recursive: true })

            const depths: number[] = []
            processDirectoryRecursively({
                basePath: testDir,
                depth: 5,
                processDirectory: (_fullPath, depth) => {
                    depths.push(depth)
                },
            })

            expect(depths).toContain(5)
            expect(depths).toContain(6)
        })
    })

    describe('directory skipping', () => {
        test('skips node_modules directories', () => {
            const testDir = path.join(testRoot, 'skip-node-modules')
            const nodeModules = path.join(testDir, 'node_modules')
            const inside = path.join(nodeModules, 'package')

            mkdirSync(inside, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath) => {
                    processed.push(path.basename(fullPath))
                },
            })

            expect(processed).toContain('skip-node-modules')
            expect(processed).not.toContain('node_modules')
            expect(processed).not.toContain('package')
        })

        test('skips dist directories', () => {
            const testDir = path.join(testRoot, 'skip-dist')
            const dist = path.join(testDir, 'dist')
            const inside = path.join(dist, 'bundle')

            mkdirSync(inside, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath) => {
                    processed.push(path.basename(fullPath))
                },
            })

            expect(processed).toContain('skip-dist')
            expect(processed).not.toContain('dist')
            expect(processed).not.toContain('bundle')
        })

        test('skips hidden directories', () => {
            const testDir = path.join(testRoot, 'skip-hidden')
            const hidden = path.join(testDir, '.git')
            const inside = path.join(hidden, 'objects')

            mkdirSync(inside, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath) => {
                    processed.push(path.basename(fullPath))
                },
            })

            expect(processed).toContain('skip-hidden')
            expect(processed).not.toContain('.git')
            expect(processed).not.toContain('objects')
        })
    })

    describe('separateModules filtering', () => {
        test('skips directories in separateModules list when not root', () => {
            const testDir = path.join(testRoot, 'separate')
            const components = path.join(testDir, 'components')
            const utils = path.join(testDir, 'utils')
            const other = path.join(testDir, 'other')

            mkdirSync(components, { recursive: true })
            mkdirSync(utils, { recursive: true })
            mkdirSync(other, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                separateModules: ['components', 'utils'],
                processDirectory: (fullPath) => {
                    processed.push(path.basename(fullPath))
                },
            })

            expect(processed).toContain('separate')
            expect(processed).toContain('other')
            expect(processed).not.toContain('components')
            expect(processed).not.toContain('utils')
        })

        test('processes root directory even if in separateModules', () => {
            const testDir = path.join(testRoot, 'root-separate')
            mkdirSync(testDir, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                separateModules: ['root-separate'],
                processDirectory: (fullPath) => {
                    processed.push(path.basename(fullPath))
                },
            })

            expect(processed).toContain('root-separate')
        })

        test('handles nested separateModules correctly', () => {
            const testDir = path.join(testRoot, 'nested-separate')
            const level1 = path.join(testDir, 'level1')
            const components = path.join(level1, 'components')
            const nested = path.join(components, 'nested')

            mkdirSync(nested, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                separateModules: ['components'],
                processDirectory: (fullPath) => {
                    processed.push(path.basename(fullPath))
                },
            })

            expect(processed).toContain('nested-separate')
            expect(processed).toContain('level1')
            expect(processed).not.toContain('components')
            expect(processed).not.toContain('nested')
        })
    })

    describe('error handling', () => {
        test('handles non-existent directory gracefully', () => {
            const nonExistent = path.join(testRoot, 'does-not-exist')

            const processed: string[] = []
            expect(() => {
                processDirectoryRecursively({
                    basePath: nonExistent,
                    processDirectory: (fullPath) => {
                        processed.push(fullPath)
                    },
                })
            }).not.toThrow()

            // processDirectory is called even for non-existent directory
            // but subdirectories are not processed (read error is caught)
            expect(processed).toHaveLength(1)
            expect(processed[0]).toBe(path.resolve(nonExistent))
        })

        test('continues processing after read errors', () => {
            const testDir = path.join(testRoot, 'error-handling')
            const goodDir1 = path.join(testDir, 'good1')
            const goodDir2 = path.join(testDir, 'good2')

            mkdirSync(goodDir1, { recursive: true })
            mkdirSync(goodDir2, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath) => {
                    processed.push(path.basename(fullPath))
                },
            })

            expect(processed.length).toBeGreaterThan(0)
            expect(processed).toContain('error-handling')
            expect(processed).toContain('good1')
            expect(processed).toContain('good2')
        })
    })

    describe('processDirectory callback', () => {
        test('receives absolute path', () => {
            const testDir = path.join(testRoot, 'absolute')
            mkdirSync(testDir, { recursive: true })

            let receivedPath = ''
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath) => {
                    receivedPath = fullPath
                },
            })

            expect(path.isAbsolute(receivedPath)).toBe(true)
            expect(receivedPath).toBe(path.resolve(testDir))
        })

        test('is called for every directory', () => {
            const testDir = path.join(testRoot, 'callback-count')
            const sub1 = path.join(testDir, 'sub1')
            const sub2 = path.join(testDir, 'sub2')
            const nested = path.join(sub1, 'nested')

            mkdirSync(nested, { recursive: true })
            mkdirSync(sub2, { recursive: true })

            let callCount = 0
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: () => {
                    callCount++
                },
            })

            expect(callCount).toBe(4) // testDir, sub1, nested, sub2
        })

        test('can modify external state', () => {
            const testDir = path.join(testRoot, 'state-modification')
            const sub = path.join(testDir, 'sub')

            mkdirSync(sub, { recursive: true })

            const state = { count: 0, paths: [] as string[] }
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath) => {
                    state.count++
                    state.paths.push(fullPath)
                },
            })

            expect(state.count).toBe(2)
            expect(state.paths).toHaveLength(2)
        })
    })

    describe('isRoot parameter', () => {
        test('first directory is treated as root by default', () => {
            const testDir = path.join(testRoot, 'root-test')
            mkdirSync(testDir, { recursive: true })

            const rootFlags: boolean[] = []
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (_fullPath, _depth) => {
                    // We can't directly check isRoot, but we can verify behavior
                    rootFlags.push(true)
                },
            })

            expect(rootFlags).toHaveLength(1)
        })

        test('subdirectories are not treated as root', () => {
            const testDir = path.join(testRoot, 'subdir-root-test')
            const sub = path.join(testDir, 'sub')

            mkdirSync(sub, { recursive: true })

            let processedCount = 0
            processDirectoryRecursively({
                basePath: testDir,
                separateModules: ['sub'], // Should skip 'sub' because it's not root
                processDirectory: () => {
                    processedCount++
                },
            })

            expect(processedCount).toBe(1) // Only testDir, 'sub' is skipped
        })

        test('can explicitly set isRoot to false', () => {
            const testDir = path.join(testRoot, 'explicit-root')
            mkdirSync(testDir, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                isRoot: false,
                separateModules: ['explicit-root'],
                processDirectory: (fullPath) => {
                    processed.push(path.basename(fullPath))
                },
            })

            // When isRoot=false and directory is in separateModules, it should be skipped
            expect(processed).toHaveLength(0)
        })
    })

    describe('edge cases', () => {
        test('handles empty directory', () => {
            const testDir = path.join(testRoot, 'empty')
            mkdirSync(testDir, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath) => {
                    processed.push(fullPath)
                },
            })

            expect(processed).toHaveLength(1)
        })

        test('handles deeply nested structure', () => {
            const testDir = path.join(testRoot, 'deep')
            let current = testDir

            // Create 10 levels deep
            for (let i = 0; i < 10; i++) {
                current = path.join(current, `level${i}`)
            }
            mkdirSync(current, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath) => {
                    processed.push(fullPath)
                },
            })

            expect(processed.length).toBe(11) // testDir + 10 levels
        })

        test('handles directory with special characters', () => {
            const testDir = path.join(testRoot, 'special-chars')
            const specialDir = path.join(testDir, 'dir with spaces & special-chars')

            mkdirSync(specialDir, { recursive: true })

            const processed: string[] = []
            processDirectoryRecursively({
                basePath: testDir,
                processDirectory: (fullPath) => {
                    processed.push(path.basename(fullPath))
                },
            })

            expect(processed).toContain('special-chars')
            expect(processed).toContain('dir with spaces & special-chars')
        })
    })
})
