import args from 'pkgs/args'
import { Console.log } from 'sky/utilities/Console

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

Console.log('Test Option: ', testOption)
