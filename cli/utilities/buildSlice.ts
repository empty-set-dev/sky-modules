import { execSync } from 'child_process'
import { writeFileSync, mkdirSync, existsSync, copyFileSync, readFileSync, statSync } from 'fs'
import path from 'path'

import Console from './Console'
import generateSliceGlobal from './generateSliceGlobal'
import generateSliceIndex from './generateSliceIndex'
import generateSlicePackageJson from './generateSlicePackageJson'
import skyPath from './skyPath'

// Supported file extensions for modules and tests
const MODULE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']
const TEST_EXTENSIONS = [
    '.test.ts',
    '.spec.ts',
    '.test.tsx',
    '.spec.tsx',
    '.test.js',
    '.spec.js',
    '.test.jsx',
    '.spec.jsx',
]

/**
 * Find module file with supported extensions
 */
function findModuleFile(modulePath: string): string | null {
    for (const ext of MODULE_EXTENSIONS) {
        const filePath = `${modulePath}${ext}`

        if (existsSync(filePath)) {
            return filePath
        }
    }

    return null
}

/**
 * Generate find command for test files
 */
function generateTestFindCommand(modulePath: string): string {
    const patterns = TEST_EXTENSIONS.map(ext => `-name "*${ext}"`).join(' -o ')
    return `find "${modulePath}" ${patterns}`
}

interface BuildOptions {
    slicePath: string
    outputDir?: string
    verbose?: boolean
}

export default async function buildSlice(options: BuildOptions): Promise<void> {
    const { slicePath, outputDir = '.dev/slices', verbose = false } = options

    const sourceDir = path.join(skyPath, slicePath)
    const buildDir = path.join(skyPath, outputDir, slicePath)

    // Создаем папку для сборки
    mkdirSync(buildDir, { recursive: true })

    if (verbose) {
        Console.log(`🔨 Building slice: ${slicePath}`)
    }

    // 1. Generate package.json
    const packageJson = generateSlicePackageJson(slicePath)
    writeFileSync(path.join(buildDir, 'package.json'), JSON.stringify(packageJson, null, 2))

    // 2. Copy only modules specified in slice.json
    const sliceJsonPath = path.join(sourceDir, 'slice.json')

    if (!existsSync(sliceJsonPath)) {
        throw new Error(`slice.json not found in ${slicePath}`)
    }

    const sliceConfig = JSON.parse(readFileSync(sliceJsonPath, 'utf-8'))
    const modules = sliceConfig.modules || []

    if (modules.length === 0) {
        throw new Error(`No modules specified in slice.json for ${slicePath}`)
    }

    // Copy slice.json and generate index.ts
    const sliceJsonSourcePath = path.join(sourceDir, 'slice.json')

    if (existsSync(sliceJsonSourcePath)) {
        execSync(`cp "${sliceJsonSourcePath}" "${buildDir}/"`, {
            stdio: verbose ? 'inherit' : 'pipe',
        })
    }

    // Generate index.ts file based on slice.json
    const indexContent = generateSliceIndex(slicePath)
    writeFileSync(path.join(buildDir, 'index.ts'), indexContent)

    // Generate global.ts file for all .global.ts imports
    const globalContent = generateSliceGlobal(slicePath)
    writeFileSync(path.join(buildDir, 'global.ts'), globalContent)

    // Copy each specified module
    for (const moduleName of modules) {
        const modulePath = path.join(sourceDir, moduleName)
        const moduleDestPath = path.join(buildDir, moduleName)

        try {
            if (existsSync(modulePath) && statSync(modulePath).isDirectory()) {
                // Module is a directory - copy contents to avoid nested structure
                mkdirSync(moduleDestPath, { recursive: true })
                execSync(`cp -r "${modulePath}"/* "${moduleDestPath}/"`, {
                    stdio: verbose ? 'inherit' : 'pipe',
                })
            } else {
                // Try to find single file module with supported extensions
                const moduleFile = findModuleFile(modulePath)

                if (moduleFile) {
                    execSync(`cp "${moduleFile}" "${buildDir}/"`, {
                        stdio: verbose ? 'inherit' : 'pipe',
                    })
                } else {
                    Console.warn(`⚠️  Module ${moduleName} not found in ${slicePath}`)
                }
            }
        } catch (error) {
            throw new Error(`Failed to copy module ${moduleName}: ${error}`)
        }
    }

    // index.ts is now managed manually in each slice

    // 4. Create dist folder
    const distDir = path.join(buildDir, 'dist')
    mkdirSync(distDir, { recursive: true })

    // 5. Run tests for slice modules
    await runSliceTests(slicePath, modules, verbose)

    // 6. Compile TypeScript
    await buildTypeScript(buildDir, distDir, verbose)

    // 7. Copy README files from docs if they exist
    const docsPath = path.join(skyPath, 'docs', 'modules', slicePath)
    const docsReadmePath = path.join(docsPath, 'mergeNamespace.md')
    const docsReadmeRuPath = path.join(docsPath, 'mergeNamespace.ru.md')

    if (existsSync(docsReadmePath)) {
        copyFileSync(docsReadmePath, path.join(buildDir, 'README.md'))
    }

    if (existsSync(docsReadmeRuPath)) {
        copyFileSync(docsReadmeRuPath, path.join(buildDir, 'README.ru.md'))
    }

    // Also copy local README if exists (fallback)
    const localReadmePath = path.join(sourceDir, 'README.md')

    if (existsSync(localReadmePath) && !existsSync(path.join(buildDir, 'README.md'))) {
        copyFileSync(localReadmePath, path.join(buildDir, 'README.md'))
    }

    if (verbose) {
        Console.log(`✅ Successfully built slice: ${slicePath}`)
    }
}

async function runSliceTests(
    slicePath: string,
    modules: string[],
    verbose: boolean
): Promise<void> {
    if (verbose) {
        Console.log(`🧪 Running tests for slice: ${slicePath}`)
    }

    const sourceDir = path.join(skyPath, slicePath)
    const testFiles: string[] = []

    // Find test files for each module
    for (const moduleName of modules) {
        const modulePath = path.join(sourceDir, moduleName)

        try {
            if (existsSync(modulePath) && statSync(modulePath).isDirectory()) {
                // Directory module - find test files inside (including TSX)
                const files = execSync(generateTestFindCommand(modulePath), {
                    encoding: 'utf8',
                    stdio: 'pipe',
                })
                    .trim()
                    .split('\n')
                    .filter(Boolean)
                testFiles.push(...files)
            } else {
                // Single file module - check for corresponding test file with all extensions
                const testVariants = [
                    ...TEST_EXTENSIONS.map(ext => `${modulePath}${ext}`),
                    ...TEST_EXTENSIONS.map(ext => path.join(sourceDir, `${moduleName}${ext}`)),
                ]

                for (const testPath of testVariants) {
                    if (existsSync(testPath)) {
                        testFiles.push(testPath)
                        break
                    }
                }
            }
        } catch (error) {
            // Ignore find errors for modules without tests
            error
        }
    }

    if (testFiles.length === 0) {
        if (verbose) {
            Console.log(`   ℹ️  No test files found for slice ${slicePath}`)
        }

        return
    }

    if (verbose) {
        Console.log(`   Found ${testFiles.length} test file(s)`)
        testFiles.forEach(file => Console.log(`     • ${file}`))
    }

    // Run tests using the project's test command
    try {
        const testCommand = `npx vitest run ${testFiles.join(' ')}`

        if (verbose) {
            Console.log(`   Running: ${testCommand}`)
        }

        execSync(testCommand, {
            cwd: skyPath,
            stdio: verbose ? 'inherit' : 'pipe',
        })

        if (verbose) {
            Console.log(`   ✅ All tests passed for slice ${slicePath}`)
        }
    } catch (error) {
        throw new Error(`Tests failed for slice ${slicePath}: ${error}`)
    }
}

async function buildTypeScript(buildDir: string, distDir: string, verbose: boolean): Promise<void> {
    // Find main module file (index.ts)
    const indexPath = path.join(buildDir, 'index.ts')

    if (!existsSync(indexPath)) {
        throw new Error(`Index file not found: ${indexPath}`)
    }

    // Check if global.ts exists to include it in compilation
    const globalTsExists = existsSync(path.join(buildDir, 'global.ts'))
    const includePatterns = [
        path.join(buildDir, '**/*.ts'),
        path.join(buildDir, '**/*.tsx'),
        path.join(buildDir, '**/*.js'),
        path.join(buildDir, '**/*.jsx'),
    ]

    // Create temporary tsconfig for build
    const tsConfig = {
        compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'node',
            jsx: 'preserve', // Preserve JSX to allow custom jsxImportSource
            declaration: true,
            declarationMap: true,
            sourceMap: true,
            outDir: './dist',
            strict: true,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            isolatedModules: true,
            typeRoots: [],
            types: [], // Don't include default types to avoid conflicts
        },
        include: includePatterns,
        exclude: [
            'node_modules',
            '**/*.test.*',
            '**/*.spec.*',
            'dist/**/*',
            '.dev/**/*',
            'boilerplates/**/*',
        ],
        ...(globalTsExists && {
            files: ['global.ts', 'index.ts'], // Include global types first
        }),
    }

    const tsConfigPath = path.join(buildDir, 'tsconfig.build.json')
    writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2))

    try {
        // Compile TypeScript
        execSync(`pnpm exec tsc -p "${tsConfigPath}"`, {
            cwd: skyPath,
            stdio: verbose ? 'inherit' : 'pipe',
        })

        // Create ESM and CJS versions for all JS files
        const jsFiles = execSync('find . -name "*.js" -type f', {
            cwd: distDir,
            encoding: 'utf8',
        })
            .trim()
            .split('\n')
            .filter(Boolean)

        for (const jsFile of jsFiles) {
            const fullPath = path.join(distDir, jsFile)
            const mjsPath = fullPath.replace(/\.js$/, '.mjs')
            const cjsPath = fullPath.replace(/\.js$/, '.cjs')

            // Create ESM version (.mjs)
            if (existsSync(fullPath)) {
                copyFileSync(fullPath, mjsPath)
            }

            // Create CommonJS version (.cjs)
            if (existsSync(fullPath)) {
                const content = readFileSync(fullPath, 'utf-8')
                const cjsContent = convertToCjs(content)
                writeFileSync(cjsPath, cjsContent)
            }
        }
    } catch (error) {
        throw new Error(`TypeScript compilation failed: ${error}`)
    }
}

function convertToCjs(esmContent: string): string {
    // Simple ESM to CJS conversion
    return esmContent
        .replace(/export\s+default\s+/g, 'module.exports = ')
        .replace(/export\s*\{([^}]+)\}/g, (_, exports) => {
            const namedExports = exports.split(',').map((exp: string) => exp.trim())
            return namedExports.map((exp: string) => `module.exports.${exp} = ${exp}`).join('\n')
        })
        .replace(/import\s+([^'"]+)\s+from\s+['"]([^'"]+)['"]/g, 'const $1 = require("$2")')
}
