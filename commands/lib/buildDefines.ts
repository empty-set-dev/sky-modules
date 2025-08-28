import fs from 'fs'
import path from 'path'

import SkyConfig from 'sky/configuration/SkyConfig'
import Console from 'sky/utilities/Console'

type Defines = {
    [k: string | symbol]: Defines
} & {
    [listSymbol]?: Record<string, number>
}

const listSymbol = Symbol('list')
let uniqueId = 1

export default function buildDefines(skyConfig: SkyConfig): boolean {
    try {
        removeDeep('.dev/defines')
        const defines: Defines = {}
        readDeep('.', defines, skyConfig)
        writeDeep('.dev/defines', defines)
    } catch (error: unknown) {
        if (!(error instanceof Error)) {
            throw Error('buildDefines: unknown error')
        }

        Console.error(error.message)
        return false
    }
    return true
}

function removeDeep(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
        return
    }

    const dirs = fs.readdirSync(dirPath)
    dirs.forEach(dir => {
        const subDirPath = path.join(dirPath, dir)

        if (fs.statSync(subDirPath).isDirectory()) {
            removeDeep(subDirPath)
        } else {
            fs.rmSync(subDirPath)
        }
    })

    fs.rmdirSync(dirPath)
}

function writeDeep(dirPath: string, defines: Defines): void {
    fs.mkdirSync(dirPath, { recursive: true })

    fs.writeFileSync(
        path.join(dirPath, 'index.ts'),
        defines[listSymbol] != null
            ? `import "sky/standard/define/global";\n\nglobal.loadDefines(${JSON.stringify(defines[listSymbol], null, '  ')})`
            : '',
        'utf-8'
    )

    Object.keys(defines).forEach(k => writeDeep(`.dev/defines/${k}`, defines[k] as Defines))
}

function readDeep(dirPath: string, defines: Defines, skyConfig: SkyConfig): void {
    const dirs = fs.readdirSync(dirPath)
    dirs.forEach(dir => {
        if (dir === 'node_modules' || dir === 'public' || dir === 'assets' || dir.startsWith('.')) {
            return
        }

        const subDirPath = path.join(dirPath, dir)
        if (fs.statSync(subDirPath).isDirectory()) {
            readDeep(subDirPath, defines, skyConfig)
        } else {
            const extName = path.extname(dir)
            if (
                extName !== '.js' &&
                extName !== '.jsx' &&
                extName !== '.ts' &&
                extName !== '.tsx'
            ) {
                return
            }

            readFile(subDirPath, defines, skyConfig)
        }
    })
}

function getFileModule(filePath: string, skyConfig: SkyConfig): null | string {
    let i = -1
    let moduleId!: null | string

    Object.keys(skyConfig.modules).forEach(k => {
        const module = skyConfig.modules[k]

        const modulePath = module.path === '.' ? '' : module.path
        if (filePath.startsWith(modulePath) && i < modulePath.length) {
            i = modulePath.length
            moduleId = module.id
        }
    })

    Object.keys(skyConfig.examples).forEach(k => {
        const module = skyConfig.examples[k]

        const modulePath = module.path === '.' ? '' : module.path
        if (filePath.startsWith(modulePath) && i < modulePath.length) {
            i = modulePath.length
            moduleId = module.id
        }
    })

    Object.keys(skyConfig.apps).forEach(k => {
        const module = skyConfig.apps[k]

        const modulePath = module.path === '.' ? '' : module.path
        if (filePath.startsWith(modulePath) && i < modulePath.length) {
            i = modulePath.length
            moduleId = module.id
        }
    })

    return moduleId
}

function readFile(filePath: string, defines: Defines, skyConfig: SkyConfig): void {
    const module = getFileModule(filePath, skyConfig)

    if (module == null) {
        return
    }

    defines[module] ??= {}

    const content = fs.readFileSync(filePath, 'utf-8')

    {
        using matchAll = content.matchAll(/defineSchema\(['"`](.+?)['"`]/g)

        for (using match of matchAll) {
            const define = match[1]
            addDefine(define, filePath, module, defines)
        }
    }

    {
        using matchAll = content.matchAll(/define\(['"`](.+?)['"`]/g)

        for (using match of matchAll) {
            const define = match[1]
            addDefine(define, filePath, module, defines)
        }
    }
}

function addDefine(define: string, filePath: string, module: string, defines: Defines): void {
    if (
        define.length <= module.length + 1 ||
        !define.startsWith(`${module.replaceAll('/', '.')}.`)
    ) {
        throw Error(`Error: "${filePath}" contain invalid define: "${define}"`)
    }

    if (defines[listSymbol] && defines[listSymbol][define]) {
        throw Error(`Error: "${filePath}" contain duplicate define: "${define}"`)
    }

    const id = define.slice(module.length + 1)

    const subIds = id.split('.')

    let current = defines[module]
    defines[listSymbol] ??= {}
    defines[listSymbol][define] = uniqueId
    let fullId = ''

    for (const subId of subIds) {
        current[listSymbol] ??= {}
        current[listSymbol][`${module}.${id}`] = uniqueId

        fullId = fullId === '' ? `${module}/${subId}` : `${fullId}/${subId}`
        current[fullId] ??= {}
        current = current[fullId]
    }

    current[listSymbol] ??= {}
    current[listSymbol][`${module}.${id}`] = uniqueId

    ++uniqueId
}
