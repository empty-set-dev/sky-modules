import fs from 'fs'
import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import run from './lib/run'

export default function add(argv: ArgumentsCamelCase<{ externalModulePath: string }>): void {
    const externalModulePath = argv.externalModulePath

    if (!externalModulePath) {
        throw new Error('module path missing')
    }

    if (
        !fs.existsSync(path.resolve(externalModulePath, 'package.json')) ||
        !fs.existsSync(path.resolve(externalModulePath, '.sky/sky.config.ts'))
    ) {
        throw new Error(`${externalModulePath}: not a sky module`)
    }

    if (!fs.existsSync('.dev/modules.json')) {
        fs.writeFileSync('.dev/modules.json', JSON.stringify({}))
    }

    const moduleName = JSON.parse(
        fs.readFileSync(path.resolve(externalModulePath, 'package.json'), 'utf-8')
    ).name

    const resolvedModulePath = path.resolve(externalModulePath)

    if (exists('.dev', moduleName)) {
        await run(`pnpm uninstall ${moduleName}`)
    }

    await run(`pnpm i ${resolvedModulePath}`, {
        cwd: path.resolve('.dev'),
    })

    const modules = JSON.parse(fs.readFileSync('.dev/modules.json', 'utf-8'))
    modules[moduleName] = externalModulePath
    fs.writeFileSync('.dev/modules.json', JSON.stringify(modules))

    if (exists('', moduleName)) {
        await run(`pnpm uninstall ${moduleName}`)
    }

    await run(`pnpm i .dev/node_modules/${moduleName}`)
    await run(`pnpm sky init`)
}

function exists(dir: string, moduleName: string): boolean {
    let exists = false

    Object.keys(
        JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8')).dependencies ?? {}
    ).forEach(k => {
        if (k === moduleName) {
            exists = true
        }
    })

    Object.keys(
        JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8')).devDependencies ?? {}
    ).forEach(k => {
        if (k === moduleName) {
            exists = true
        }
    })

    return exists
}
