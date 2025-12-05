import '../configuration/Sky.Module.namespace'
import '../configuration/Sky.Workspace.namespace'

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

interface BuildDefinesContext {
    workspace: Sky.WorkspaceConfig
    modules: Map<string, Sky.Module>
    apps: Map<string, Sky.App>
}

export default function buildDefines(
    workspace: Sky.WorkspaceConfig,
    modules: Map<string, Sky.Module>,
    apps: Map<string, Sky.App>
): void {
    rmDeep('.dev/defines')
    const defines: Defines = {}
    const context: BuildDefinesContext = { workspace, modules, apps }
    readDeep('.', defines, context)
    writeDeep('.dev/defines', defines, context)
}

function writeDeep(dirPath: string, defines: Defines, context: BuildDefinesContext): void {
    fs.mkdirSync(dirPath, { recursive: true })

    let list = defines[listSymbol]
    const shortDirPath = dirPath.slice('.dev/defines'.length + 1)
    const module = getFileModule(shortDirPath, context, true)

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
            ? `import { define, loadDefines } from "@sky-modules/core";\n\n` +
                  `loadDefines(${JSON.stringify(list, null, '  ')})`
            : '',
        'utf-8'
    )

    Object.keys(defines).forEach(k =>
        writeDeep(`.dev/defines/${k}`, defines[k] as Defines, context)
    )
}

function readDeep(dirPath: string, defines: Defines, context: BuildDefinesContext): void {
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

        if (dirPath.indexOf('node_modules') !== dirPath.lastIndexOf('node_modules')) {
            return
        }

        if (dirPath.indexOf(`node_modules/${context.workspace.nameId}`) !== -1) {
            return
        }

        const subDirPath = path.join(dirPath, dir)

        if (fs.statSync(subDirPath).isDirectory()) {
            readDeep(subDirPath, defines, context)
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

            if (subDirPath.indexOf(`.test.`) !== -1) {
                return
            }

            if (subDirPath.indexOf(`.spec.`) !== -1) {
                return
            }

            readFile(subDirPath, defines, context)
        }
    })
}

function getFileModule(
    filePath: string,
    context: BuildDefinesContext,
    byAppId?: boolean
): null | Sky.Module | Sky.App {
    let i = -1
    let fileModule: null | Sky.Module | Sky.App = null

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

    // Check modules
    for (const module of context.modules.values()) {
        const modulePath = module.path === '.' ? '' : module.path

        if (
            i < modulePath.length && byAppId
                ? byID(module.id, filePath)
                : byPath(modulePath, filePath)
        ) {
            i = modulePath.length
            fileModule = module
        }
    }

    // Check apps
    for (const app of context.apps.values()) {
        const appPath = app.path === '.' ? '' : app.path

        if (
            i < appPath.length && byAppId
                ? byID(app.id, filePath)
                : byPath(appPath, filePath)
        ) {
            i = appPath.length
            fileModule = app
        }
    }

    return fileModule
}

function readFile(filePath: string, defines: Defines, context: BuildDefinesContext): void {
    const module = getFileModule(filePath, context)

    if (module == null) {
        return
    }

    defines[module.id] ??= {}

    let content = fs.readFileSync(filePath, 'utf-8')

    // Remove comments to avoid parsing examples in JSDoc
    content = content
        // Remove single-line comments
        .replace(/\/\/.*$/gm, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')

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
        throw new Error(`"${filePath}" contain invalid define: "${define}"`)
    }

    if (defines[listSymbol] && defines[listSymbol][define]) {
        throw new Error(`"${filePath}" contain duplicate define: "${define}"`)
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
