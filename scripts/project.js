/* eslint-disable @typescript-eslint/explicit-function-return-type */
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const process = require('process')

const b = '\x1b['
const e = '\x1b[0m'

const sdkPath = path.relative(process.cwd(), path.resolve(__dirname, '../'))

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
const localDependencies = packageJson.localDependencies ?? []
const packageModules = packageJson.modules ?? []

const paths = [
    ...localDependencies.map(dep => `${dep}/*`),
    path.join(sdkPath, 'includes/*'),
    path.join(sdkPath, 'node_modules/*'),
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
    path.resolve(__dirname, '../tsconfig.json'),
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
            ${packageModules.map(module => `"${module}/*" : ["${module}/*"]`).join(',\n          ')}
        }
    },
    "include": [${packageModules
        .map(module => `"${module}"`)
        .join(', ')}, "../Modules/node_modules/"],
    "exclude": ["node_modules", ${localDependencies
        .map(dep => `${dep}/node_modules`)
        .join(', ')} "../Modules/node_modules"]
}
        
`
)

process.stdout.write(` 👌\n`)
