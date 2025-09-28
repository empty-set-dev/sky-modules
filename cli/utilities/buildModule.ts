import { execSync } from 'child_process'
import { writeFileSync, mkdirSync, existsSync, copyFileSync, readFileSync, statSync } from 'fs'
import { join } from 'path'

import Console from './Console'
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
    modulePath: string
    outputDir?: string
    verbose?: boolean
}

export default async function buildModule(options: BuildOptions): Promise<void> {
    const { modulePath, outputDir = '.dev/modules', verbose = false } = options

    const sourceDir = join(skyPath, modulePath)
    const buildDir = join(skyPath, outputDir, modulePath)

    // Создаем папку для сборки
    mkdirSync(buildDir, { recursive: true })

    if (verbose) {
        Console.log(`🔨 Building module: ${modulePath}`)
    }

    // 1. Generate package.json (reuse slice package generator but for modules)
    const packageJson = generateSlicePackageJson(modulePath)
    writeFileSync(join(buildDir, 'package.json'), JSON.stringify(packageJson, null, 2))

    // 2. Copy only modules specified in module.json
    const moduleJsonPath = join(sourceDir, 'module.json')

    if (!existsSync(moduleJsonPath)) {
        throw new Error(`module.json not found in ${modulePath}`)
    }

    const moduleConfig = JSON.parse(readFileSync(moduleJsonPath, 'utf-8'))
    const modules = moduleConfig.modules || []

    if (modules.length === 0) {
        throw new Error(`No modules specified in module.json for ${modulePath}`)
    }

    // Copy module.json
    const moduleJsonSourcePath = join(sourceDir, 'module.json')

    if (existsSync(moduleJsonSourcePath)) {
        execSync(`cp "${moduleJsonSourcePath}" "${buildDir}/"`, {
            stdio: verbose ? 'inherit' : 'pipe',
        })
    }


    // Copy each specified module
    for (const moduleName of modules) {
        const moduleItemPath = join(sourceDir, moduleName)
        const moduleDestPath = join(buildDir, moduleName)

        try {
            if (existsSync(moduleItemPath) && statSync(moduleItemPath).isDirectory()) {
                // Module is a directory - copy contents to avoid nested structure
                mkdirSync(moduleDestPath, { recursive: true })
                // Exclude package.json from copying to avoid overwriting the generated one
                execSync(
                    `find "${moduleItemPath}" -mindepth 1 -maxdepth 1 ! -name "package.json" -exec cp -r {} "${moduleDestPath}/" \\;`,
                    {
                        stdio: verbose ? 'inherit' : 'pipe',
                    }
                )
            } else {
                // Try to find single file module with supported extensions
                const moduleFile = findModuleFile(moduleItemPath)

                if (moduleFile) {
                    execSync(`cp "${moduleFile}" "${buildDir}/"`, {
                        stdio: verbose ? 'inherit' : 'pipe',
                    })
                } else {
                    Console.warn(`⚠️  Module ${moduleName} not found in ${modulePath}`)
                }
            }
        } catch (error) {
            throw new Error(`Failed to copy module ${moduleName}: ${error}`)
        }
    }

    // 3. Create dist folder
    const distDir = join(buildDir, 'dist')
    mkdirSync(distDir, { recursive: true })

    // 4. Run tests for module modules
    await runModuleTests(modulePath, modules, verbose)

    // 5. Compile TypeScript
    await buildTypeScript(buildDir, distDir, sourceDir, verbose, modules, modulePath, packageJson.name)

    // 6. Copy README files from docs if they exist
    const docsPath = join(skyPath, 'docs', 'modules', modulePath)
    const docsReadmePath = join(docsPath, 'README.md')
    const docsReadmeRuPath = join(docsPath, 'README.ru.md')

    if (existsSync(docsReadmePath)) {
        copyFileSync(docsReadmePath, join(buildDir, 'README.md'))
    }

    if (existsSync(docsReadmeRuPath)) {
        copyFileSync(docsReadmeRuPath, join(buildDir, 'README.ru.md'))
    }

    // Also copy local README if exists (fallback)
    const localReadmePath = join(sourceDir, 'README.md')

    if (existsSync(localReadmePath) && !existsSync(join(buildDir, 'README.md'))) {
        copyFileSync(localReadmePath, join(buildDir, 'README.md'))
    }

    if (verbose) {
        Console.log(`✅ Successfully built module: ${modulePath}`)
    }
}

async function runModuleTests(
    modulePath: string,
    modules: string[],
    verbose: boolean
): Promise<void> {
    if (verbose) {
        Console.log(`🧪 Running tests for module: ${modulePath}`)
    }

    const sourceDir = join(skyPath, modulePath)
    const testFiles: string[] = []

    // Find test files for each module
    for (const moduleName of modules) {
        const moduleItemPath = join(sourceDir, moduleName)

        try {
            if (existsSync(moduleItemPath) && statSync(moduleItemPath).isDirectory()) {
                // Directory module - find test files inside (including TSX)
                const files = execSync(generateTestFindCommand(moduleItemPath), {
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
                    ...TEST_EXTENSIONS.map(ext => `${moduleItemPath}${ext}`),
                    ...TEST_EXTENSIONS.map(ext => join(sourceDir, `${moduleName}${ext}`)),
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
            Console.log(`   ℹ️  No test files found for module ${modulePath}`)
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
            Console.log(`   ✅ All tests passed for module ${modulePath}`)
        }
    } catch (error) {
        throw new Error(`Tests failed for module ${modulePath}: ${error}`)
    }
}

async function buildTypeScript(
    buildDir: string,
    distDir: string,
    sourceDir: string,
    verbose: boolean,
    modules: string[],
    modulePath: string,
    packageName: string
): Promise<void> {
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
            baseUrl: '.',
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
        ],
    }

    const tsConfigPath = join(buildDir, 'tsconfig.build.json')
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
            const fullPath = join(distDir, jsFile)
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
    let currentDir = startDir

    while (currentDir !== join(currentDir, '..')) {
        const tsConfigPath = join(currentDir, 'tsconfig.json')

        if (existsSync(tsConfigPath)) {
            return tsConfigPath
        }

        currentDir = join(currentDir, '..')
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
