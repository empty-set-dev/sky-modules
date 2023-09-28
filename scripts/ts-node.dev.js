/* eslint-disable @typescript-eslint/explicit-function-return-type */
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

if (fs.existsSync(path.resolve(__dirname, '../src/index.tsx'))) {
    run(path.join(__dirname, '../src/index.tsx'))
} else if (fs.existsSync(path.resolve(__dirname, '../src/index.ts'))) {
    run(path.join(__dirname, '../src/index.ts'))
} else if (fs.existsSync(path.resolve(__dirname, '../server/index.ts'))) {
    run(path.join(__dirname, '../server/index.ts'))
}

function run(scriptPath) {
    child_process.execSync(
        `tsnd --cls --respawn -r tsconfig-paths/register\
            -- ${scriptPath}
        `,
        { stdio: 'inherit', stdout: 'inherit', stdin: 'inherit' }
    )
}
