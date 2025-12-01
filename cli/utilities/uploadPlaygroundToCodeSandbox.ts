import { createHash } from 'crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'

import Console from './Console'
import workspaceRoot from './workspaceRoot'

interface SandboxFile {
    content: string
    isBinary: boolean
}

interface SandboxFiles {
    [path: string]: SandboxFile
}

interface SandboxCache {
    [playgroundName: string]: {
        hash: string
        sandboxId: string
        url: string
        timestamp: string
    }
}

interface PlaygroundLinks {
    version: string
    sandboxes: {
        [playgroundName: string]: string
    }
    timestamp: string
}

/**
 * Upload playground examples to CodeSandbox with hash-based caching
 */
export async function uploadPlaygroundToCodeSandbox(): Promise<void> {
    if (workspaceRoot == null) {
        throw new Error('Sky workspace not found')
    }

    Console.log('🎮 Uploading playground examples to CodeSandbox...')

    const playgroundDir = join(workspaceRoot, 'playground')
    const cacheDir = join(workspaceRoot, '.dev', 'playground-cache')
    const cacheFile = join(cacheDir, 'sandboxes.json')
    const docsDir = join(workspaceRoot, 'docs', '.vitepress')

    // Create cache directory if it doesn't exist
    if (!existsSync(cacheDir)) {

        mkdirSync(cacheDir, { recursive: true })
    }

    // Load cache
    let cache: SandboxCache = {}
    if (existsSync(cacheFile)) {
        cache = JSON.parse(readFileSync(cacheFile, 'utf-8'))
    }

    // Get version from environment or git branch
    const version = process.env.VITEPRESS_VERSION || 'draft'

    // Scan playground directories (skip public, node_modules, hidden folders, and folders without package.json)
    const playgrounds = readdirSync(playgroundDir).filter(name => {
        const path = join(playgroundDir, name)
        const packageJsonPath = join(path, 'package.json')
        return (
            statSync(path).isDirectory() &&
            !name.startsWith('.') &&
            name !== 'node_modules' &&
            name !== 'public' &&
            existsSync(packageJsonPath)
        )
    })

    const playgroundLinks: PlaygroundLinks = {
        version,
        sandboxes: {},
        timestamp: new Date().toISOString(),
    }

    let uploadedCount = 0
    let cachedCount = 0

    for (const playgroundName of playgrounds) {
        const playgroundPath = join(playgroundDir, playgroundName)

        Console.log(`  Processing ${playgroundName}...`)

        // Collect all files recursively
        const files: SandboxFiles = {}
        collectFiles(playgroundPath, '', files)

        // Calculate hash of all files
        const hash = calculateHash(files)

        // Check cache
        const cached = cache[playgroundName]

        if (cached && cached.hash === hash) {
            Console.log(`    ✓ Using cached sandbox (${cached.sandboxId})`)
            playgroundLinks.sandboxes[playgroundName] = cached.url
            cachedCount++
            continue
        }

        // Upload to CodeSandbox
        try {
            const result = await uploadToCodeSandbox(files, playgroundName)

            cache[playgroundName] = {
                hash,
                sandboxId: result.sandboxId,
                url: result.url,
                timestamp: new Date().toISOString(),
            }

            playgroundLinks.sandboxes[playgroundName] = result.url

            Console.log(`    ✓ Uploaded to CodeSandbox (${result.sandboxId})`)
            uploadedCount++
        } catch (error) {
            Console.error(`    ✗ Failed to upload ${playgroundName}:`, error)
            // Use cached version if available, even if it's old
            if (cached) {
                playgroundLinks.sandboxes[playgroundName] = cached.url
                Console.log(`    → Using old cached version (${cached.sandboxId})`)
            }
        }
    }

    // Save cache
    writeFileSync(cacheFile, JSON.stringify(cache, null, 2))

    // Save playground links for VitePress (in public folder so it's copied to dist)
    const publicDir = join(workspaceRoot, 'docs', 'public')
    if (!existsSync(publicDir)) {
        mkdirSync(publicDir, { recursive: true })
    }
    const linksFile = join(publicDir, 'playground-links.json')
    writeFileSync(linksFile, JSON.stringify(playgroundLinks, null, 2))

    // Also save to .vitepress for development
    const devLinksFile = join(docsDir, 'playground-links.json')
    writeFileSync(devLinksFile, JSON.stringify(playgroundLinks, null, 2))

    Console.log(
        `\n✅ Playground upload complete! Uploaded: ${uploadedCount}, Cached: ${cachedCount}, Total: ${playgrounds.length}`
    )
}

/**
 * Collect all files from a directory recursively
 */
function collectFiles(dir: string, prefix: string, files: SandboxFiles): void {
    const entries = readdirSync(dir)

    for (const entry of entries) {
        // Skip hidden files, node_modules, and lock files
        if (
            entry.startsWith('.') ||
            entry === 'node_modules' ||
            entry === 'pnpm-lock.yaml' ||
            entry === 'package-lock.json' ||
            entry === 'yarn.lock'
        ) {
            continue
        }

        const fullPath = join(dir, entry)
        const relativePath = prefix ? `${prefix}/${entry}` : entry
        const stat = statSync(fullPath)

        if (stat.isDirectory()) {
            collectFiles(fullPath, relativePath, files)
        } else {
            const content = readFileSync(fullPath, 'utf-8')
            files[relativePath] = {
                content,
                isBinary: false,
            }
        }
    }
}

/**
 * Calculate hash of all files
 */
function calculateHash(files: SandboxFiles): string {
    const hash = createHash('sha256')

    // Sort files by path for consistent hashing
    const sortedPaths = Object.keys(files).sort()

    for (const path of sortedPaths) {
        hash.update(path)
        hash.update(files[path].content)
    }

    return hash.digest('hex')
}

/**
 * Upload to CodeSandbox using Define API
 */
async function uploadToCodeSandbox(
    files: SandboxFiles,
    playgroundName: string
): Promise<{ sandboxId: string; url: string }> {
    // Prepare files for CodeSandbox
    const parameters = {
        files: {} as Record<string, { content: string }>,
    }

    for (const [path, file] of Object.entries(files)) {
        parameters.files[path] = {
            content: file.content,
        }
    }

    // Add package.json if it doesn't exist
    if (!parameters.files['package.json']) {
        parameters.files['package.json'] = {
            content: JSON.stringify(
                {
                    name: playgroundName,
                    version: '1.0.0',
                    description: `Sky Modules Playground: ${playgroundName}`,
                    main: 'index.ts',
                    scripts: {
                        start: 'vite',
                        build: 'vite build',
                    },
                    dependencies: {
                        '@sky-modules/core': 'latest',
                        vite: '^5.0.0',
                    },
                },
                null,
                2
            ),
        }
    }

    // Upload to CodeSandbox
    const response = await fetch('https://codesandbox.io/api/v1/sandboxes/define?json=1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            files: parameters.files,
        }),
    })

    if (!response.ok) {
        throw new Error(`CodeSandbox API error: ${response.status} ${response.statusText}`)
    }

    const result = (await response.json()) as { sandbox_id: string }

    return {
        sandboxId: result.sandbox_id,
        url: `https://codesandbox.io/s/${result.sandbox_id}`,
    }
}
