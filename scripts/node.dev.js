/* eslint-disable @typescript-eslint/explicit-function-return-type */
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

const name = process.argv[2]

if (name == null || name === '') {
    // eslint-disable-next-line no-console
    console.error('missing app name')
    return
}

let existsTsx = fs.existsSync(path.resolve(name, 'index.tsx'))
let existsTs = fs.existsSync(path.resolve(name, 'index.ts'))
if (!existsTsx && !existsTs) {
    // eslint-disable-next-line no-console
    console.error('missing entry')
    return
}

run(
    path.relative(
        process.cwd(),
        existsTsx ? path.resolve(name, 'index.tsx') : path.resolve(name, 'index.ts')
    ),
    process.argv.slice(3).join(' ')
)

function run(scriptPath, args) {
    child_process.execSync(
        `node --require=${path.relative(
            process.cwd(),
            path.resolve(__dirname, '../node_modules/suppress-experimental-warnings')
        )} --expose-gc --loader=ts-node/esm ${scriptPath} ${args}`,
        {
            stdio: 'inherit',
            stdout: 'inherit',
            stdin: 'inherit',
        }
    )
}
