import { exec } from 'child_process'
import { promisify } from 'util'
import { mkdirSync, rmSync, existsSync, writeFileSync, readdirSync } from 'fs'
import { join } from 'path'

const execAsync = promisify(exec)

/**
 * Get the e2e tests directory path
 */
function getE2ETestsDir(): string {
    return join(process.cwd(), '.dev', 'e2e-tests')
}

/**
 * Clean up old e2e test workspaces (older than 1 hour)
 */
export function cleanupOldWorkspaces(): void {
    const e2eDir = getE2ETestsDir()

    if (!existsSync(e2eDir)) {
        return
    }

    const now = Date.now()
    const oneHourAgo = now - 60 * 60 * 1000

    try {
        const entries = readdirSync(e2eDir, { withFileTypes: true })

        for (const entry of entries) {
            if (!entry.isDirectory()) continue

            const dirPath = join(e2eDir, entry.name)

            // Try to get directory creation time from name (timestamp)
            const timestampMatch = entry.name.match(/(\d{13})/)
            if (timestampMatch) {
                const timestamp = parseInt(timestampMatch[1], 10)
                if (timestamp < oneHourAgo) {
                    rmSync(dirPath, { recursive: true, force: true })
                }
            }
        }
    } catch (error) {
        // Ignore cleanup errors
    }
}

/**
 * Result of running a CLI command
 */
export interface CommandResult {
    stdout: string
    stderr: string
    exitCode: number
    error?: Error
}

/**
 * Execute a sky CLI command in a test environment
 */
export async function runSkyCommand(
    command: string,
    options?: {
        cwd?: string
        env?: Record<string, string>
        timeout?: number
    }
): Promise<CommandResult> {
    const cwd = options?.cwd || process.cwd()
    const timeout = options?.timeout || 30000
    const env = {
        ...process.env,
        ...options?.env,
    }

    try {
        const { stdout, stderr } = await execAsync(`sky ${command}`, {
            cwd,
            env,
            timeout,
        })

        return {
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            exitCode: 0,
        }
    } catch (error: any) {
        return {
            stdout: error.stdout?.trim() || '',
            stderr: error.stderr?.trim() || '',
            exitCode: error.code || 1,
            error,
        }
    }
}

/**
 * Create a temporary test workspace
 */
export class TestWorkspace {
    public path: string
    private isSetup = false

    constructor(name?: string) {
        const timestamp = Date.now()
        const workspaceName = name || `sky-test-${timestamp}`
        // Use .dev/e2e-tests directory instead of system temp
        this.path = join(getE2ETestsDir(), workspaceName)

        // Clean up old workspaces on first instantiation
        cleanupOldWorkspaces()
    }

    /**
     * Setup the test workspace (create directory)
     */
    setup(): void {
        if (this.isSetup) return

        if (existsSync(this.path)) {
            rmSync(this.path, { recursive: true, force: true })
        }

        mkdirSync(this.path, { recursive: true })
        this.isSetup = true
    }

    /**
     * Cleanup the test workspace (remove directory)
     */
    cleanup(): void {
        if (!this.isSetup) return

        try {
            if (existsSync(this.path)) {
                rmSync(this.path, { recursive: true, force: true, maxRetries: 3 })
            }
        } catch (error) {
            // Log error but don't throw to avoid breaking test cleanup
            console.warn(`Failed to cleanup workspace ${this.path}:`, error)
        }

        this.isSetup = false
    }

    /**
     * Write a file to the workspace
     */
    writeFile(relativePath: string, content: string): string {
        if (!this.isSetup) {
            throw new Error('Workspace not setup. Call setup() first.')
        }

        const filePath = join(this.path, relativePath)
        const dir = join(filePath, '..')

        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true })
        }

        writeFileSync(filePath, content, 'utf-8')
        return filePath
    }

    /**
     * Get absolute path to a file in the workspace
     */
    resolve(...paths: string[]): string {
        return join(this.path, ...paths)
    }

    /**
     * Run a sky command in this workspace
     */
    async runCommand(
        command: string,
        options?: Omit<Parameters<typeof runSkyCommand>[1], 'cwd'>
    ): Promise<CommandResult> {
        return runSkyCommand(command, {
            ...options,
            cwd: this.path,
        })
    }
}

/**
 * Create a test workspace with automatic cleanup
 */
export function createTestWorkspace(name?: string): {
    workspace: TestWorkspace
    cleanup: () => void
} {
    const workspace = new TestWorkspace(name)
    workspace.setup()

    return {
        workspace,
        cleanup: () => workspace.cleanup(),
    }
}

/**
 * Parse JSON output from a command
 */
export function parseCommandJSON<T = any>(result: CommandResult): T {
    try {
        return JSON.parse(result.stdout)
    } catch (error) {
        throw new Error(`Failed to parse command output as JSON: ${result.stdout}`)
    }
}

/**
 * Assert that a command succeeded
 */
export function assertCommandSuccess(result: CommandResult, message?: string): void {
    if (result.exitCode !== 0) {
        const errorMsg = message || 'Command failed'
        throw new Error(
            `${errorMsg}\nExit code: ${result.exitCode}\nStdout: ${result.stdout}\nStderr: ${result.stderr}`
        )
    }
}

/**
 * Assert that a command failed
 */
export function assertCommandFailed(result: CommandResult, message?: string): void {
    if (result.exitCode === 0) {
        const errorMsg = message || 'Expected command to fail but it succeeded'
        throw new Error(`${errorMsg}\nStdout: ${result.stdout}\nStderr: ${result.stderr}`)
    }
}

/**
 * Check if command output contains a string
 */
export function commandOutputContains(result: CommandResult, searchString: string): boolean {
    return result.stdout.includes(searchString) || result.stderr.includes(searchString)
}
