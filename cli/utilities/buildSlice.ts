import { execSync } from 'child_process'
import { writeFileSync, mkdirSync, existsSync, copyFileSync, readFileSync, statSync } from 'fs'
import path from 'path'

import Console from './Console'
import generateSliceGlobal from './generateSliceGlobal'
import generateSliceIndex from './generateSliceIndex'
import generateSlicePackageJson from './generateSlicePackageJson'
import workspaceRoot from './workspaceRoot'

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
    if (workspaceRoot == null) {
        throw Error('Sky workspace not found')
    }

    const { slicePath, outputDir = '.dev/slices', verbose = false } = options

    const sourceDir = path.join(workspaceRoot, slicePath)
    const buildDir = path.join(workspaceRoot, outputDir, slicePath)

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
                // Exclude package.json from copying to avoid overwriting the generated one
                execSync(
                    `find "${modulePath}" -mindepth 1 -maxdepth 1 ! -name "package.json" -exec cp -r {} "${moduleDestPath}/" \\;`,
                    {
                        stdio: verbose ? 'inherit' : 'pipe',
                    }
                )
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
    // Remove existing dist directory if it exists to avoid conflicts
    try {
        execSync(`rm -rf "${distDir}"`, { stdio: 'pipe' })
    } catch {
        // Ignore errors if directory doesn't exist
    }
    mkdirSync(distDir, { recursive: true })

    // 5. Run tests for slice modules
    await runSliceTests(slicePath, modules, verbose)

    // 6. Compile TypeScript
    await buildTypeScript(buildDir, distDir, sourceDir, verbose, modules, packageJson.name)

    // 7. Copy README files from docs if they exist
    const docsPath = path.join(workspaceRoot, 'docs', 'modules', slicePath)
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
    if (workspaceRoot == null) {
        throw Error('Sky workspace not found')
    }

    if (verbose) {
        Console.log(`🧪 Running tests for slice: ${slicePath}`)
    }

    const sourceDir = path.join(workspaceRoot, slicePath)
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
        const testCommand = `sky test ${slicePath}`

        if (verbose) {
            Console.log(`   Running: ${testCommand}`)
        }

        execSync(testCommand, {
            cwd: workspaceRoot,
            stdio: verbose ? 'inherit' : 'pipe',
        })

        if (verbose) {
            Console.log(`   ✅ All tests passed for slice ${slicePath}`)
        }
    } catch (error) {
        throw new Error(`Tests failed for slice ${slicePath}: ${error}`)
    }
}

async function buildTypeScript(
    buildDir: string,
    distDir: string,
    sourceDir: string,
    verbose: boolean,
    modules: string[],
    packageName: string
): Promise<void> {
    // Find main module file (index.ts)
    const indexPath = path.join(buildDir, 'index.ts')

    if (!existsSync(indexPath)) {
        throw new Error(`Index file not found: ${indexPath}`)
    }

    // Find nearest tsconfig.json by walking up from the source directory
    const nearestTsConfig = findNearestTsConfig(sourceDir)

    if (!nearestTsConfig) {
        throw new Error(`No tsconfig.json found in ${sourceDir} or parent directories`)
    }

    // Read the existing tsconfig
    const baseTsConfig = JSON.parse(readFileSync(nearestTsConfig, 'utf-8'))

    // Include only files from specified modules (relative to buildDir)
    const includePatterns: string[] = []

    for (const moduleName of modules) {
        if (moduleName === '.') {
            // For "." module, include all files from current directory
            includePatterns.push(
                '*.ts',
                '*.tsx',
                '*.js',
                '*.jsx',
                '**/*.ts',
                '**/*.tsx',
                '**/*.js',
                '**/*.jsx'
            )
        } else {
            // For specific modules, include only that module's files
            includePatterns.push(
                `${moduleName}/**/*.ts`,
                `${moduleName}/**/*.tsx`,
                `${moduleName}/**/*.js`,
                `${moduleName}/**/*.jsx`
            )
        }
    }

    // Create a clean tsconfig for build-specific overrides
    const tsConfig = {
        compilerOptions: {
            ...baseTsConfig.compilerOptions,
            declaration: true,
            declarationMap: true,
            sourceMap: true,
            outDir: './dist',
            skipLibCheck: true,
            rootDir: '.',
            paths: {
                [`${packageName}/*`]: ['./*'],
            },
        },
        include: includePatterns,
        exclude: [
            'node_modules',
            '**/*.test.*',
            '**/*.spec.*',
            'dist',
            'dist/**/*',
            '**/.dev/**/*',
            '../**/*',
        ],
        files: ['index.ts'], // Only include index.ts, exclude global.ts
    }

    const tsConfigPath = path.join(buildDir, 'tsconfig.build.json')
    writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2))

    try {
        // Compile TypeScript from buildDir
        execSync(`npx tsc -p "tsconfig.build.json"`, {
            cwd: buildDir,
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

function findNearestTsConfig(startDir: string): string | null {
    let currentDir = path.resolve(startDir)

    while (currentDir !== path.dirname(currentDir)) {
        const tsConfigPath = path.join(currentDir, 'tsconfig.json')

        if (existsSync(tsConfigPath)) {
            return tsConfigPath
        }

        currentDir = path.dirname(currentDir)
    }

    return null
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
