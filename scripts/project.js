#!/usr/bin/env node
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const process = require('process')

const b = '\x1b['
const e = '\x1b[0m'

const sdkPath = path.relative(process.cwd(), path.resolve(__dirname, '../'))

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))

const paths = [
    ...(packageJson.localDependencies ?? []).map(dep => `${dep}/*`),
    path.join(sdkPath, 'includes/*'),
    path.join(sdkPath, 'node_modules/*'),
]
    .map(path => `"${path}"`)
    .join(', ')

const include = packageJson.modules && packageJson.modules.length > 0
    ? `"include": [${(packageJson.modules ?? [])
        .map(module => `"${module}"`)
        .join(', ')}],\n`
    : ''

const exclude = [
    'node_modules',
    ...(packageJson.localDependencies ?? [])
        .map(dep => `${dep}/node_modules`),
    path.join(sdkPath, 'node_modules'),
]
    .map(path => `"${path}"`)
    .join(', ')

process.stdout.write(`${b}35;1minstall packages${e}\n`)
child_process.execSync(
    `npm i --force -D\
 eslint eslint-config-prettier\
 eslint-plugin-prettier\
 eslint-plugin-react\
 eslint-plugin-react-hooks\
 @typescript-eslint/eslint-plugin\
 @typescript-eslint/parser\
 prettier\
 prettier-plugin-tailwind\
 @ianvs/prettier-plugin-sort-imports\
`,
    { stdio: 'inherit', stdout: 'inherit', stdin: 'inherit' }
)
process.stdout.write(`\n${b}${'35;1m'}install packages${e} 👌\n`)

process.stdout.write(`${b}${'35;1m'}rewrite configs${e}`)
fs.writeFileSync(
    path.resolve('tsconfig.json'),
    `{
    "compilerOptions": {
        "lib": ["ES2021", "DOM"],
        "jsx": "react-jsx",
        "module": "ES2022",
        "target": "ES2017",
        "moduleResolution": "node",

        "esModuleInterop": true,

        "typeRoots": [
            "${path.join(sdkPath, 'node_modules/@types')}"
        ],
        "baseUrl": ".",
        "paths": {
            "*": [${paths}],
            ${(packageJson.modules ?? [])
                .map(module => `"${module}/*" : ["${module}/*"]`)
                .join(',\n          ')}
        }
    },
    ${include}    "exclude": [${exclude}]
}
`
)

process.stdout.write(` 👌\n`)
