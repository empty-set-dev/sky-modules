import { logConsole } from 'sky/utilities/console'
import args from 'sky/pkgs/args'

args.option('testOption', 'Test Option', 42)
args.command('testCommand', 'Test Command', () => {
    // eslint-disable-next-line no-console
    console.log('Run Test Command')
})

const { testOption } = args.parse(process.argv, {
    name: 'node example',
    mainColor: 'magenta',
    subColor: 'grey',
    mri: {},
})

logConsole('Test Option: ', testOption)
