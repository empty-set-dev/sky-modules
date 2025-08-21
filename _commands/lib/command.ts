import args from 'args'

import importFile from './importFile'

export async function multi_command(
    name: string,
    commands: { name: string; description: string; run?: () => void | Promise<void> }[]
): Promise<void> {
    const command = process.argv[3]

    if (!command) {
        const defaultCommand = commands.find(
            command => command.name === '' && command.run != null
        ) as (typeof commands)[0] & { run: () => void | Promise<void> }
        if (defaultCommand != null) {
            await defaultCommand.run()
        } else {
            initArgs()
            args.showHelp()
        }
    } else if (!(await importFile(`./${name}-${command}.ts`))) {
        initArgs()
        Console.error(`${name}: command "${command}" not found`)
        args.showHelp()
    }

    function initArgs(): void {
        commands.forEach(command => args.command(command.name, command.description))

        args.parse(process.argv, {
            name: `sky ${name}`,
            mainColor: 'magenta',
            subColor: 'grey',
            mri: {},
        })
    }
}

export async function command(
    name: string,
    description: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (flags: Record<string, any>) => void | Promise<void>
): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    args.command(name, description, () => {})

    const flags = args.parse(process.argv, {
        name: 'sky',
        mainColor: 'magenta',
        subColor: 'grey',
        mri: {},
    })

    await callback(flags)
}
