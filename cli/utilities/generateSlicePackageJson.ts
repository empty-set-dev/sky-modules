import '@sky-modules/cli/configuration/Sky.Slice.namespace'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

import workspaceRoot from './workspaceRoot'

interface GeneratedPackageJson {
    name: string
    version: string
    description: string
    keywords: string[]
    author: {
        name: string
        email: string
    }
    license: string
    repository: {
        type: string
        url: string
        directory: string
    }
    homepage: string
    publishConfig: {
        access: 'public' | 'restricted'
    }
    main: string
    module: string
    types: string
    exports: Record<
        string,
        {
            import: string
            require: string
            types: string
        }
    >
    dependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
}

export default function generateSlicePackageJson(slicePath: string): GeneratedPackageJson {
    if (workspaceRoot == null) {
        throw new Error('Sky workspace not found')
    }

    // Read main package.json
    const mainPackageJson = JSON.parse(readFileSync(join(workspaceRoot, 'package.json'), 'utf-8'))

    // Read slice.json or module.json
    const sliceJsonPath = join(workspaceRoot, slicePath, 'slice.json')
    const moduleJsonPath = join(workspaceRoot, slicePath, 'module.json')
    let sliceConfig: Partial<Sky.Slice> = {}

    if (existsSync(sliceJsonPath)) {
        sliceConfig = JSON.parse(readFileSync(sliceJsonPath, 'utf-8'))
    } else if (existsSync(moduleJsonPath)) {
        sliceConfig = JSON.parse(readFileSync(moduleJsonPath, 'utf-8'))
    }

    // Generate package name
    const packageName = sliceConfig.name || `@sky-modules/${slicePath}`

    // Generate homepage URL
    const homepage = `${mainPackageJson.repository.url.replace('.git', '')}#readme`

    return {
        name: packageName,
        version: mainPackageJson.version,
        description: sliceConfig.description || `Sky module: ${slicePath}`,
        keywords: sliceConfig.keywords || ['sky', 'typescript', 'utility'],
        author: mainPackageJson.author,
        license: mainPackageJson.license,
        repository: {
            type: 'git',
            url: mainPackageJson.repository.url,
            directory: slicePath,
        },
        homepage,
        publishConfig: {
            access: sliceConfig.access || 'public',
        },
        main: './dist/index.cjs',
        module: './dist/index.mjs',
        types: './dist/index.d.ts',
        exports: generateExports(sliceConfig.modules || []),
        ...(sliceConfig.dependencies && { dependencies: sliceConfig.dependencies }),
        ...(sliceConfig.peerDependencies && { peerDependencies: sliceConfig.peerDependencies }),
    }
}

function generateExports(
    modules: string[]
): Record<string, { import: string; require: string; types: string }> {
    const exports: Record<string, { import: string; require: string; types: string }> = {
        '.': {
            import: './dist/index.mjs',
            require: './dist/index.cjs',
            types: './dist/index.d.ts',
        },
    }

    // Add exports for each module
    for (const moduleName of modules) {
        // Skip "." as it's already handled above
        if (moduleName === '.') {
            continue
        }

        // Check if module is a directory or file by checking if it has an extension
        const isFile = moduleName.includes('.') && !moduleName.includes('/')

        if (isFile) {
            // Single file module (e.g., "canClone.ts" -> "canClone")
            const nameWithoutExt = moduleName.replace(/\.[^/.]+$/, '')
            exports[`./${nameWithoutExt}`] = {
                import: `./dist/${nameWithoutExt}.mjs`,
                require: `./dist/${nameWithoutExt}.cjs`,
                types: `./dist/${nameWithoutExt}.d.ts`,
            }
        } else {
            // Directory module (e.g., "mergeNamespace/")
            exports[`./${moduleName}`] = {
                import: `./dist/${moduleName}/index.mjs`,
                require: `./dist/${moduleName}/index.cjs`,
                types: `./dist/${moduleName}/index.d.ts`,
            }
        }
    }

    return exports
}
