import '@sky-modules/cli/configuration/Sky.Config.global'
import '@sky-modules/cli/configuration/Sky.Module.global'

import fs from 'fs'
import path from 'path'

import rmDeep from './rmDeep'

type Defines = {
    [k: string | symbol]: Defines
} & {
    [listSymbol]?: Record<string, number>
}

const listSymbol = Symbol('list')
let uniqueId = 1

export default function buildDefines(skyConfig: Sky.Config): void {
    rmDeep('.dev/defines')
    const defines: Defines = {}
    readDeep('.', defines, skyConfig)
    writeDeep('.dev/defines', defines, skyConfig)
}

function writeDeep(dirPath: string, defines: Defines, skyConfig: Sky.Config): void {
    fs.mkdirSync(dirPath, { recursive: true })

    let list = defines[listSymbol]
    const shortDirPath = dirPath.slice('.dev/defines'.length + 1)
    const module = getFileModule(shortDirPath, skyConfig, true)

    if (shortDirPath === module?.id && list != null) {
        const newList: Record<string, number> = {}

        Object.keys(list)
            .filter(define => {
                const defineWithoutModuleID = define.slice(module.id.length + 1)

                if (
                    defineWithoutModuleID.startsWith('server.') ||
                    defineWithoutModuleID === 'server'
                ) {
                    return false
                }

                return true
            })
            .forEach(define => {
                if (list != null) {
                    newList[define] = list[define]
                }
            })

        list = newList
    }

    fs.writeFileSync(
        path.join(dirPath, 'index.ts'),
        defines[listSymbol] != null
            ? `import "sky/core/define/global";\n\nglobal.loadDefines(${JSON.stringify(list, null, '  ')})`
            : '',
        'utf-8'
    )

    Object.keys(defines).forEach(k =>
        writeDeep(`.dev/defines/${k}`, defines[k] as Defines, skyConfig)
    )
}

function readDeep(dirPath: string, defines: Defines, skyConfig: Sky.Config): void {
    const dirs = fs.readdirSync(dirPath)
    dirs.forEach(dir => {
        if (
            dir === 'public' ||
            dir === 'assets' ||
            dir === '.dev' ||
            dir === 'boilerplates' ||
            dir.startsWith('.')
        ) {
            return
        }

        if (
            dirPath.match('node_modules') &&
            `${dirPath}/${dir}`.match('node_modules/sky') == null
        ) {
            return
        }

        if (`${dirPath}/${dir}`.match('node_modules/sky/playground')) {
            return
        }

        if (dirPath.indexOf('node_modules') !== dirPath.lastIndexOf('node_modules')) {
            return
        }

        if (dirPath.indexOf(`node_modules/${skyConfig.nameId}`) !== -1) {
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

function getFileModule(
    filePath: string,
    skyConfig: Sky.Config,
    byAppId?: boolean
): null | Sky.Module {
    let i = -1
    let fileModule: null | Sky.Module = null

    function byPath(modulePath: string, filePath: string): boolean {
        modulePath = modulePath === '.' ? '' : modulePath

        if (filePath.startsWith(modulePath) && i < modulePath.length) {
            return true
        }

        return false
    }

    function byID(moduleID: string, fileModuleID: string): boolean {
        moduleID = moduleID === '.' ? '' : moduleID

        if (fileModuleID.startsWith(moduleID) && i < moduleID.length) {
            return true
        }

        return false
    }

    Object.keys(skyConfig.modules).forEach(k => {
        const module = skyConfig.modules[k]
        const modulePath = module.path === '.' ? '' : module.path

        if (
            i < modulePath.length && byAppId
                ? byID(module.id, filePath)
                : byPath(modulePath, filePath)
        ) {
            i = modulePath.length
            fileModule = module
        }
    })

    Object.keys(skyConfig.playground).forEach(k => {
        const module = skyConfig.playground[k]
        const modulePath = module.path === '.' ? '' : module.path

        if (
            i < modulePath.length && byAppId
                ? byID(module.id, filePath)
                : byPath(modulePath, filePath)
        ) {
            i = modulePath.length
            fileModule = module
        }
    })

    Object.keys(skyConfig.apps).forEach(k => {
        const module = skyConfig.apps[k]
        const modulePath = module.path === '.' ? '' : module.path

        if (
            i < modulePath.length && byAppId
                ? byID(module.id, filePath)
                : byPath(modulePath, filePath)
        ) {
            i = modulePath.length
            fileModule = module
        }
    })

    return fileModule
}

function readFile(filePath: string, defines: Defines, skyConfig: Sky.Config): void {
    const module = getFileModule(filePath, skyConfig)

    if (module == null) {
        return
    }

    defines[module.id] ??= {}

    const content = fs.readFileSync(filePath, 'utf-8')

    for (const match of content.matchAll(/defineSchema\([\n\r \t]*['"`](.+?)['"`]/g)) {
        const define = match[1]
        addDefine(define, filePath, module.id, defines)
    }

    for (const match of content.matchAll(/define\([\n\r \t]*['"`](.+?)['"`]/g)) {
        const define = match[1]
        addDefine(define, filePath, module.id, defines)
    }
}

function addDefine(define: string, filePath: string, module: string, defines: Defines): void {
    if (
        define.length <= module.length + 1 ||
        !define.startsWith(`${module.replaceAll('/', '.')}.`)
    ) {
        throw new Error(`Error: "${filePath}" contain invalid define: "${define}"`)
    }

    if (defines[listSymbol] && defines[listSymbol][define]) {
        throw new Error(`Error: "${filePath}" contain duplicate define: "${define}"`)
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
