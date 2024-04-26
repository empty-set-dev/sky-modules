import __import from './__import'

const command = process.argv[3]
if (!command) {
    // eslint-disable-next-line no-console
    console.error(`node: missing command`)
}
else if (!__import(`./node-${command}.ts`)) {
    // eslint-disable-next-line no-console
    console.error(`node: command "${command}" not found`)
}
