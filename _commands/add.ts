#!/usr/bin/env -S pnpm exec tsx
import fs from 'fs'
import path from 'path'

import args from 'args'

import __run from './__run'

args.command('add', 'Add module')

args.parse(process.argv, {
    name: 'sky init',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

add()

function add(): void {
    let modulePath = args.sub[1]

    if (!modulePath) {
        throw Error('module path missing')
    }

    const moduleName = JSON.parse(
        fs.readFileSync(path.resolve(modulePath, 'package.json'), 'utf-8')
    ).name

    modulePath = path.resolve(modulePath)

    __run(`pnpm link ${modulePath}`, {
        cwd: path.resolve('.dev'),
    })

    const modules = JSON.parse(fs.readFileSync('.dev/modules.json', 'utf-8'))
    modules[moduleName] = modulePath
    fs.writeFileSync('.dev/modules.json', JSON.stringify(modules))

    __run(`pnpm link .dev/node_modules/${moduleName}`)
    __run(`npx sky init`)
}
