import child_process from 'child_process'

export default function __run(command: string, options?: object): Buffer {
    return child_process.execSync(command, {
        stdio: 'inherit',
        ...(options ?? {}),
    })
}
