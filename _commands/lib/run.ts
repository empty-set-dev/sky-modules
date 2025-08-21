import child_process, { ExecSyncOptionsWithBufferEncoding } from 'child_process'

export default function run(
    command: string,
    parameters?: ExecSyncOptionsWithBufferEncoding
): Buffer {
    return child_process.execSync(
        command,
        Object.assign(
            {
                stdio: 'inherit',
            },
            parameters
        )
    )
}
