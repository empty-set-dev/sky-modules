#!/usr/bin/env node
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const child_process = require('child_process')
const path = require('path')

const name = process.argv[2]

child_process.execSync(
    `${path.resolve(__dirname, '../node_modules/.bin/serve')} dist/${name} -p 80`,
    {
        stdio: 'inherit',
        stdout: 'inherit',
        stdin: 'inherit',
    }
)
