import { execSync } from 'child_process'
import { writeFileSync, mkdirSync, existsSync, copyFileSync, readFileSync, statSync } from 'fs'
import { join } from 'path'
import skyPath from './skyPath'
import generateSlicePackageJson from './generateSlicePackageJson'
import generateSliceIndex from './generateSliceIndex'
import generateSliceGlobal from './generateSliceGlobal'

interface BuildOptions {
    slicePath: string
    outputDir?: string
    verbose?: boolean
}

export default async function buildSlice(options: BuildOptions): Promise<void> {
    const { slicePath, outputDir = '.dev/slices', verbose = false } = options

    const sourceDir = join(skyPath, slicePath)
    const buildDir = join(skyPath, outputDir, slicePath)

    // Создаем папку для сборки
    mkdirSync(buildDir, { recursive: true })

    if (verbose) {
        console.log(`🔨 Building slice: ${slicePath}`)
    }

    // 1. Generate package.json
    const packageJson = generateSlicePackageJson(slicePath)
    writeFileSync(
        join(buildDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    )

    // 2. Copy only modules specified in slice.json
    const sliceJsonPath = join(sourceDir, 'slice.json')
    if (!existsSync(sliceJsonPath)) {
        throw new Error(`slice.json not found in ${slicePath}`)
    }

    const sliceConfig = JSON.parse(readFileSync(sliceJsonPath, 'utf-8'))
    const modules = sliceConfig.modules || []

    if (modules.length === 0) {
        throw new Error(`No modules specified in slice.json for ${slicePath}`)
    }

    // Copy slice.json and generate index.ts
    const sliceJsonSourcePath = join(sourceDir, 'slice.json')

    if (existsSync(sliceJsonSourcePath)) {
        execSync(`cp "${sliceJsonSourcePath}" "${buildDir}/"`, {
            stdio: verbose ? 'inherit' : 'pipe'
        })
    }

    // Generate index.ts file based on slice.json
    const indexContent = generateSliceIndex(slicePath)
    writeFileSync(join(buildDir, 'index.ts'), indexContent)

    // Generate global.ts file for all .global.ts imports
    const globalContent = generateSliceGlobal(slicePath)
    writeFileSync(join(buildDir, 'global.ts'), globalContent)

    // Copy each specified module
    for (const moduleName of modules) {
        const modulePath = join(sourceDir, moduleName)
        const moduleDestPath = join(buildDir, moduleName)

        try {
            if (existsSync(modulePath) && statSync(modulePath).isDirectory()) {
                // Module is a directory - copy contents to avoid nested structure
                mkdirSync(moduleDestPath, { recursive: true })
                execSync(`cp -r "${modulePath}"/* "${moduleDestPath}/"`, {
                    stdio: verbose ? 'inherit' : 'pipe'
                })
            } else if (existsSync(`${modulePath}.ts`)) {
                // Module is a single .ts file
                execSync(`cp "${modulePath}.ts" "${buildDir}/"`, {
                    stdio: verbose ? 'inherit' : 'pipe'
                })
            } else {
                console.warn(`⚠️  Module ${moduleName} not found in ${slicePath}`)
            }
        } catch (error) {
            throw new Error(`Failed to copy module ${moduleName}: ${error}`)
        }
    }

    // index.ts is now managed manually in each slice

    // 4. Create dist folder
    const distDir = join(buildDir, 'dist')
    mkdirSync(distDir, { recursive: true })

    // 5. Run tests for slice modules
    await runSliceTests(slicePath, modules, verbose)

    // 6. Compile TypeScript
    await buildTypeScript(buildDir, distDir, verbose)

    // 7. Copy README files from docs if they exist
    const docsPath = join(skyPath, 'docs', 'modules', slicePath)
    const docsReadmePath = join(docsPath, 'mergeNamespace.md')
    const docsReadmeRuPath = join(docsPath, 'mergeNamespace.ru.md')

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
        console.log(`✅ Successfully built slice: ${slicePath}`)
    }
}

async function runSliceTests(slicePath: string, modules: string[], verbose: boolean): Promise<void> {
    if (verbose) {
        console.log(`🧪 Running tests for slice: ${slicePath}`)
    }

    const sourceDir = join(skyPath, slicePath)
    const testFiles: string[] = []

    // Find test files for each module
    for (const moduleName of modules) {
        const modulePath = join(sourceDir, moduleName)

        try {
            if (existsSync(modulePath) && statSync(modulePath).isDirectory()) {
                // Directory module - find test files inside
                const files = execSync(`find "${modulePath}" -name "*.test.ts" -o -name "*.spec.ts"`, {
                    encoding: 'utf8',
                    stdio: 'pipe'
                }).trim().split('\n').filter(Boolean)
                testFiles.push(...files)
            } else {
                // Single file module - check for corresponding test file
                const testVariants = [
                    `${modulePath}.test.ts`,
                    `${modulePath}.spec.ts`,
                    join(sourceDir, `${moduleName}.test.ts`),
                    join(sourceDir, `${moduleName}.spec.ts`)
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
        }
    }

    if (testFiles.length === 0) {
        if (verbose) {
            console.log(`   ℹ️  No test files found for slice ${slicePath}`)
        }
        return
    }

    if (verbose) {
        console.log(`   Found ${testFiles.length} test file(s)`)
        testFiles.forEach(file => console.log(`     • ${file}`))
    }

    // Run tests using the project's test command
    try {
        const testCommand = `npx vitest run ${testFiles.join(' ')}`

        if (verbose) {
            console.log(`   Running: ${testCommand}`)
        }

        execSync(testCommand, {
            cwd: skyPath,
            stdio: verbose ? 'inherit' : 'pipe'
        })

        if (verbose) {
            console.log(`   ✅ All tests passed for slice ${slicePath}`)
        }
    } catch (error) {
        throw new Error(`Tests failed for slice ${slicePath}: ${error}`)
    }
}

async function buildTypeScript(buildDir: string, distDir: string, verbose: boolean): Promise<void> {
    // Find main module file (index.ts)
    const indexPath = join(buildDir, 'index.ts')
    if (!existsSync(indexPath)) {
        throw new Error(`Index file not found: ${indexPath}`)
    }

    // Create temporary tsconfig for build
    const tsConfig = {
        compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'node',
            declaration: true,
            declarationMap: true,
            sourceMap: true,
            outDir: './dist',
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true,
            typeRoots: []
        },
        files: ['index.ts'],
        exclude: ['node_modules', '**/*.test.*', '**/*.spec.*', 'dist/**/*']
    }

    const tsConfigPath = join(buildDir, 'tsconfig.build.json')
    writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2))

    try {
        // Compile TypeScript
        execSync(`npx tsc -p "${tsConfigPath}"`, {
            cwd: skyPath,
            stdio: verbose ? 'inherit' : 'pipe'
        })

        // Create ESM and CJS versions for all JS files
        const jsFiles = execSync('find . -name "*.js" -type f', {
            cwd: distDir,
            encoding: 'utf8'
        }).trim().split('\n').filter(Boolean)

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

function convertToCjs(esmContent: string): string {
    // Simple ESM to CJS conversion
    return esmContent
        .replace(/export\s+default\s+/g, 'module.exports = ')
        .replace(/export\s*\{([^}]+)\}/g, (_, exports) => {
            const namedExports = exports.split(',').map((exp: string) => exp.trim())
            return namedExports.map((exp: string) =>
                `module.exports.${exp} = ${exp}`
            ).join('\n')
        })
        .replace(/import\s+([^'"]+)\s+from\s+['"]([^'"]+)['"]/g,
            'const $1 = require("$2")')
}