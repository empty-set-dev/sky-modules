import fs from 'fs'
import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import run from './lib/run'

export default function add(argv: ArgumentsCamelCase): void {
    const externalModulePath = argv.modulePath as string

    if (!externalModulePath) {
        throw Error('module path missing')
    }

    if (
        !fs.existsSync(path.resolve(externalModulePath, 'package.json')) ||
        !fs.existsSync(path.resolve(externalModulePath, '.sky/sky.config.ts'))
    ) {
        throw Error(`${externalModulePath}: not a sky module`)
    }

    const moduleName = JSON.parse(
        fs.readFileSync(path.resolve(externalModulePath, 'package.json'), 'utf-8')
    ).name

    const resolvedModulePath = path.resolve(externalModulePath)

    run(`pnpm link ${resolvedModulePath}`, {
        cwd: path.resolve('.dev'),
    })

    const modules = JSON.parse(fs.readFileSync('.dev/modules.json', 'utf-8'))
    modules[moduleName] = externalModulePath
    fs.writeFileSync('.dev/modules.json', JSON.stringify(modules))

    run(`pnpm link .dev/node_modules/${moduleName}`)
    run(`npx sky init`)
}
