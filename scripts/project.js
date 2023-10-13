/* eslint-disable @typescript-eslint/explicit-function-return-type */
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
const process = require('process')

const b = '\x1b['
const e = '\x1b[0m'

process.stdout.write(`${b}35;1minstall packages${e}\n`)
child_process.execSync(
    `
    npm i -D\
    eslint eslint-config-prettier\
    eslint-plugin-prettier\
    eslint-plugin-react\
    eslint-plugin-react-hooks\
    @typescript-eslint/eslint-plugin\
    @typescript-eslint/parser\
    prettier\
    prettierplugin-tailwind\
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
        "lib": ["ES2017", "DOM"],
        "jsx": "react-jsx",
        "module": "ES2022",
        "target": "ES2017",
        "moduleResolution": "node",

        "typeRoots": [],
        "baseUrl": ".",
        "paths": {
        }
    },
    "include": [],
    "exclude": ["node_modules"]
}    
`
)
process.stdout.write(` 👌\n`)
