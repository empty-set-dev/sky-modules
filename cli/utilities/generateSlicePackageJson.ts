import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import skyPath from './skyPath'

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
    exports: {
        '.': {
            import: string
            require: string
            types: string
        }
    }
    dependencies?: Record<string, string>
    peerDependencies?: Record<string, string>
}

export default function generateSlicePackageJson(modulePath: string): GeneratedPackageJson {
    // Читаем основной package.json
    const mainPackageJson = JSON.parse(readFileSync(join(skyPath, 'package.json'), 'utf-8'))

    // Читаем module.json если есть
    const moduleJsonPath = join(skyPath, modulePath, 'module.json')
    let moduleConfig: Sky.ModuleConfig = {}

    if (existsSync(moduleJsonPath)) {
        moduleConfig = JSON.parse(readFileSync(moduleJsonPath, 'utf-8'))
    }

    // Генерируем имя пакета из пути
    const packageName = `@sky-modules/${modulePath.replace(/\//g, '/')}`

    // Генерируем homepage URL
    const homepage = `${mainPackageJson.repository.url.replace('.git', '')}#readme`

    return {
        name: packageName,
        version: mainPackageJson.version,
        description: moduleConfig.description || `Sky module: ${modulePath}`,
        keywords: moduleConfig.keywords || ['sky', 'typescript', 'utility'],
        author: mainPackageJson.author,
        license: mainPackageJson.license,
        repository: {
            type: 'git',
            url: mainPackageJson.repository.url,
            directory: modulePath
        },
        homepage,
        publishConfig: {
            access: moduleConfig.access || 'public'
        },
        main: './dist/index.cjs',
        module: './dist/index.mjs',
        types: './dist/index.d.ts',
        exports: {
            '.': {
                import: './dist/index.mjs',
                require: './dist/index.cjs',
                types: './dist/index.d.ts'
            }
        },
        ...(moduleConfig.dependencies && { dependencies: moduleConfig.dependencies }),
        ...(moduleConfig.peerDependencies && { peerDependencies: moduleConfig.peerDependencies })
    }
}