import __import from './__import'

const command = process.argv[3]

if (!__import(`./browser-${command}.ts`)) {
    // eslint-disable-next-line no-console
    console.error(`browser: command "${command}" not found`)
}
