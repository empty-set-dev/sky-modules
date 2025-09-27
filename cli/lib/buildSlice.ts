import { execSync } from 'child_process'
import { writeFileSync, mkdirSync, existsSync, copyFileSync, readFileSync } from 'fs'
import { join, dirname, basename } from 'path'
import skyPath from './skyPath'
import generateSlicePackageJson from './generateSlicePackageJson'

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

    // 1. Генерируем package.json
    const packageJson = generateSlicePackageJson(slicePath)
    writeFileSync(
        join(buildDir, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    )

    // 2. Копируем исходные файлы
    const srcDir = join(buildDir, 'src')
    mkdirSync(srcDir, { recursive: true })

    try {
        execSync(`cp -r "${sourceDir}"/* "${srcDir}/"`, {
            stdio: verbose ? 'inherit' : 'pipe'
        })
    } catch (error) {
        throw new Error(`Failed to copy source files: ${error}`)
    }

    // 3. Создаем dist папку
    const distDir = join(buildDir, 'dist')
    mkdirSync(distDir, { recursive: true })

    // 4. Компилируем TypeScript
    await buildTypeScript(srcDir, distDir, verbose)

    // 5. Копируем README если есть
    const readmePath = join(sourceDir, 'README.md')
    if (existsSync(readmePath)) {
        copyFileSync(readmePath, join(buildDir, 'README.md'))
    }

    if (verbose) {
        console.log(`✅ Successfully built slice: ${slicePath}`)
    }
}

async function buildTypeScript(srcDir: string, distDir: string, verbose: boolean): Promise<void> {
    // Находим главный файл модуля (index.ts)
    const indexPath = join(srcDir, 'index.ts')
    if (!existsSync(indexPath)) {
        throw new Error(`Index file not found: ${indexPath}`)
    }

    // Создаем временный tsconfig для сборки
    const tsConfig = {
        compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'node',
            declaration: true,
            declarationMap: true,
            sourceMap: true,
            outDir: distDir,
            rootDir: srcDir,
            strict: true,
            esModuleInterop: true,
            skipLibCheck: true,
            forceConsistentCasingInFileNames: true
        },
        include: [join(srcDir, '**/*')],
        exclude: ['**/*.test.*', '**/*.spec.*']
    }

    const tsConfigPath = join(dirname(srcDir), 'tsconfig.build.json')
    writeFileSync(tsConfigPath, JSON.stringify(tsConfig, null, 2))

    try {
        // Компилируем TypeScript
        execSync(`npx tsc -p "${tsConfigPath}"`, {
            cwd: skyPath,
            stdio: verbose ? 'inherit' : 'pipe'
        })

        // Создаем ESM версию (.mjs)
        const indexJsPath = join(distDir, 'index.js')
        const indexMjsPath = join(distDir, 'index.mjs')

        if (existsSync(indexJsPath)) {
            copyFileSync(indexJsPath, indexMjsPath)
        }

        // Создаем CommonJS версию (.cjs)
        const indexCjsPath = join(distDir, 'index.cjs')
        if (existsSync(indexJsPath)) {
            // Конвертируем ES модули в CommonJS
            const content = readFileSync(indexJsPath, 'utf-8')
            const cjsContent = convertToCjs(content)
            writeFileSync(indexCjsPath, cjsContent)
        }

    } catch (error) {
        throw new Error(`TypeScript compilation failed: ${error}`)
    }
}

function convertToCjs(esmContent: string): string {
    // Простая конвертация ESM в CJS
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