import child_process, { ExecSyncOptionsWithBufferEncoding } from 'child_process'

export default function __run(
    command: string,
    options?: ExecSyncOptionsWithBufferEncoding
): Buffer {
    return child_process.execSync(command, {
        stdio: 'inherit',
        ...(options ?? {}),
    })
}
