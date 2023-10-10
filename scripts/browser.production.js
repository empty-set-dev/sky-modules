/* eslint-disable @typescript-eslint/explicit-function-return-type */
const child_process = require('child_process')
const path = require('path')

child_process.execSync(`${path.resolve(__dirname, '../node_modules/.bin/serve')} dist -p 80`, {
    stdio: 'inherit',
    stdout: 'inherit',
    stdin: 'inherit',
})
