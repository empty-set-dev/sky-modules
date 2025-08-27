import fs from 'fs'
import path from 'path'

import { ArgumentsCamelCase } from 'yargs'

import run from './lib/run'

export default function add(argv: ArgumentsCamelCase): void {
    const modulePath = argv.modulePath as string

    if (!modulePath) {
        throw Error('module path missing')
    }

    if (
        !fs.existsSync(path.resolve(modulePath, 'package.json')) ||
        !fs.existsSync(path.resolve(modulePath, '.sky/sky.config.ts'))
    ) {
        throw Error(`${modulePath}: not a sky module`)
    }

    const moduleName = JSON.parse(
        fs.readFileSync(path.resolve(modulePath, 'package.json'), 'utf-8')
    ).name

    const resolvedModulePath = path.resolve(modulePath)

    run(`pnpm link ${resolvedModulePath}`, {
        cwd: path.resolve('.dev'),
    })

    const modules = JSON.parse(fs.readFileSync('.dev/modules.json', 'utf-8'))
    modules[moduleName] = modulePath
    fs.writeFileSync('.dev/modules.json', JSON.stringify(modules))

    run(`pnpm link .dev/node_modules/${moduleName}`)
    run(`npx sky init`)
}
