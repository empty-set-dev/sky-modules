import __import from './__import'

const command = process.argv[3]

if (!__import(`./node-${command}.ts`)) {
    // eslint-disable-next-line no-console
    console.error(`node: command "${command}" not found`)
}
