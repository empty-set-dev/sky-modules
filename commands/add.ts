import fs from 'fs'
import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import run from './lib/run'

export default function add(argv: ArgumentsCamelCase<{ externalModulePath: string }>): void {
    const externalModulePath = argv.externalModulePath

    if (!externalModulePath) {
        throw Error('module path missing')
    }

    if (
        !fs.existsSync(path.resolve(externalModulePath, 'package.json')) ||
        !fs.existsSync(path.resolve(externalModulePath, '.sky/sky.config.ts'))
    ) {
        throw Error(`${externalModulePath}: not a sky module`)
    }

    if (!fs.existsSync('.dev/modules.json')) {
        fs.writeFileSync('.dev/modules.json', JSON.stringify({}))
    }

    const moduleName = JSON.parse(
        fs.readFileSync(path.resolve(externalModulePath, 'package.json'), 'utf-8')
    ).name

    let exists = false

    Object.keys(JSON.parse(fs.readFileSync('package.json', 'utf-8')).dependencies ?? {}).forEach(
        k => {
            if (k === moduleName) {
                exists = true
            }
        }
    )

    Object.keys(JSON.parse(fs.readFileSync('package.json', 'utf-8')).devDependencies ?? {}).forEach(
        k => {
            if (k === moduleName) {
                exists = true
            }
        }
    )

    const resolvedModulePath = path.resolve(externalModulePath)

    run(`pnpm link ${resolvedModulePath}`, {
        cwd: path.resolve('.dev'),
    })

    const modules = JSON.parse(fs.readFileSync('.dev/modules.json', 'utf-8'))
    modules[moduleName] = externalModulePath
    fs.writeFileSync('.dev/modules.json', JSON.stringify(modules))

    if (exists) {
        run(`pnpm uninstall ${moduleName}`)
    }

    run(`pnpm link .dev/node_modules/${moduleName}`)
    run(`pnpm sky init`)
}
