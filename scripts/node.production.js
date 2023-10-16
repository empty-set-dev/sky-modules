/* eslint-disable @typescript-eslint/explicit-function-return-type */
const child_process = require('child_process')
const fs = require('fs')
const path = require('path')

if (fs.existsSync(path.resolve(__dirname, '../src/index.tsx'))) {
    run(path.resolve(__dirname, '../src/index.tsx'))
} else if (fs.existsSync(path.resolve(__dirname, '../src/index.ts'))) {
    run(path.resolve(__dirname, '../src/index.ts'))
} else if (fs.existsSync(path.resolve(__dirname, '../back-endindex.ts'))) {
    run(path.resolve(__dirname, '../back-endindex.ts'))
}

function run(scriptPath) {
    child_process.execSync(
        `node --no-warnings --expose-gc --max-old-space-size=8192 --es-module-specifier-resolution=node --loader '${path.resolve(
            __dirname,
            '-tsconfig-paths-bootstrap.mjs'
        )}' \
            ${path.relative(process.cwd(), scriptPath)}`,
        {
            stdio: 'inherit',
            stdout: 'inherit',
            stdin: 'inherit',
            env: {
                TS_NODE_TRANSPILE_ONLY: true,
            },
        }
    )
}
