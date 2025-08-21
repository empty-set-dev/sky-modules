import fs from 'fs'
import path from 'path'

import SkyConfig from 'sky/configuration/SkyConfig'

import Console from '../utilities/Console'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Defines = Record<string | symbol, any>

const listSymbol = Symbol('list')
let uniqueId = 1

export default function __buildDefines(skyConfig: SkyConfig): void {
    removeDeep('.dev/defines')
    const defines: Defines = {}
    readDeep('.', defines, skyConfig)
    writeDeep('.dev/defines', defines)
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
            ? `import "sky/standard/global";\n\nglobal.loadDefines(${JSON.stringify(defines[listSymbol], null, '  ')})`
            : '',
        'utf-8'
    )

    Object.keys(defines).forEach(k =>
        writeDeep('.dev/defines/' + k.replaceAll('.', '/'), defines[k])
    )
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

    const content = fs.readFileSync(filePath, 'utf-8')

    for (const match of content.matchAll(/define\(['"`](.+?)['"`]\)/g)) {
        const define = match[1]

        if (!define.startsWith(module.replaceAll('/', '.'))) {
            Console.error(`Error: "${filePath}" contain invalid define: "${match[1]}"`)
            continue
        }

        const id = define.slice(module.length)
        const subIds = id.split('.')

        let current = defines
        let fullId = ''

        for (const subId of subIds) {
            current[listSymbol] ??= {}
            current[listSymbol][id] = uniqueId

            fullId = fullId === '' ? subId : `${fullId}.${subId}`
            current[fullId] ??= {}
            current = current[fullId]
        }

        ++uniqueId
    }
}
