import __import from './__import'

const command = process.argv[3]

if (!command) {
    // eslint-disable-next-line no-console
    console.error(`readme: missing command`)
}
else if (!__import(`./readme-${command}.ts`)) {
    // eslint-disable-next-line no-console
    console.error(`readme: command "${command}" not found`)
}
