/* eslint-disable @typescript-eslint/explicit-function-return-type */
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

if (fs.existsSync(path.resolve(__dirname, '../src/index.tsx'))) {
    run(path.resolve(__dirname, '../src/index.tsx'))
} else if (fs.existsSync(path.resolve(__dirname, '../src/index.ts'))) {
    run(path.resolve(__dirname, '../src/index.ts'))
} else if (fs.existsSync(path.resolve(__dirname, '../server/index.ts'))) {
    run(path.resolve(__dirname, '../server/index.ts'))
}

function run(scriptPath) {
    child_process.execSync(
        `
            node -r ts-node/register -r tsconfig-paths/register\
            --expose-gc --max-old-space-size=8192\
            ${scriptPath}
        `,
        { stdio: 'inherit', stdout: 'inherit', stdin: 'inherit' }
    )
}
