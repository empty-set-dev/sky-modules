import { execSync } from 'child_process'
import { join } from 'path'

import { Argv } from 'yargs'

import buildSlice from './utilities/buildSlice'
import Console from './utilities/Console'
import findDeployableSlices from './utilities/findDeployableSlices'
import skyPath from './utilities/skyPath'

interface PublishArgs {
    slice?: string
    dryRun?: boolean
    versionBump?: 'patch' | 'minor' | 'major'
    verbose?: boolean
}

export default function init(yargs: Argv): Argv {
    return yargs
        .command(
            'slices [slice]',
            'Publish slices to npmjs.com',
            (yargs: Argv) => {
                return yargs
                    .positional('slice', {
                        type: 'string',
                        describe:
                            'Specific slice to publish (optional, publishes all if not specified)',
                    })
                    .option('dry-run', {
                        type: 'boolean',
                        default: false,
                        describe: 'Perform a dry run without actually publishing',
                    })
                    .option('version-bump', {
                        type: 'string',
                        choices: ['patch', 'minor', 'major'],
                        describe: 'Bump version before publishing',
                    })
                    .option('verbose', {
                        type: 'boolean',
                        default: false,
                        describe: 'Show verbose output',
                    })
            },
            async (argv: PublishArgs) => {
                try {
                    await publishSlices(argv)
                } catch (error) {
                    Console.error('❌ Publish failed:', error)
                    process.exit(1)
                }
            }
        )
        .completion('completion', 'Generate completion for terminal')
}

async function publishSlices(args: PublishArgs): Promise<void> {
    const { slice, dryRun, versionBump, verbose } = args

    Console.log('🚀 Starting slice publishing...')

    // Check npm authentication
    if (!dryRun) {
        try {
            execSync('npm whoami', { stdio: 'pipe' })
        } catch {
            Console.error('❌ Not logged in to npm. Run: npm login')
            return
        }
    }

    // Get list of slices to publish
    const allSlices = findDeployableSlices()
    const slicesToPublish = slice ? allSlices.filter(s => s.path === slice) : allSlices

    if (slicesToPublish.length === 0) {
        Console.log('ℹ️  No slices found to publish')
        return
    }

    Console.log(`📦 Found ${slicesToPublish.length} slice(s) to publish:`)
    slicesToPublish.forEach(s => Console.log(`   • ${s.name} (${s.path})`))

    // Bump version if specified
    if (versionBump && !dryRun) {
        Console.log(`📈 Bumping version: ${versionBump}`)
        execSync(`npm version ${versionBump} --no-git-tag-version`, {
            cwd: skyPath,
            stdio: verbose ? 'inherit' : 'pipe',
        })
    }

    // Publish each slice
    for (const sliceInfo of slicesToPublish) {
        await publishSlice(sliceInfo, { dryRun, verbose })
    }

    Console.log('✅ Publishing completed!')
}

async function publishSlice(
    sliceInfo: { path: string; name: string },
    options: { dryRun?: boolean; verbose?: boolean }
): Promise<void> {
    const { path: slicePath, name } = sliceInfo
    const { dryRun, verbose } = options

    Console.log(`\n🔨 Building slice: ${name}`)

    try {
        // Build the slice
        await buildSlice({
            slicePath,
            outputDir: '.dev/slices',
            verbose,
        })

        const buildPath = join(skyPath, '.dev/slices', slicePath)

        if (dryRun) {
            Console.log(`✅ Dry run successful for ${name}`)
            Console.log(`   Build path: ${buildPath}`)

            // Show what would be published
            if (verbose) {
                try {
                    const result = execSync('npm pack --dry-run', {
                        cwd: buildPath,
                        encoding: 'utf8',
                    })
                    Console.log('   Package contents:')
                    Console.log(
                        result
                            .split('\n')
                            .map(line => `     ${line}`)
                            .join('\n')
                    )
                } catch (error) {
                    Console.warn('   Could not preview package contents')
                }
            }
        } else {
            // Check if package exists
            const packageExists = await checkPackageExists(name)

            if (packageExists) {
                Console.log(`📦 Publishing update for ${name}`)
            } else {
                Console.log(`🆕 Publishing new package ${name}`)
            }

            // Publish package
            execSync('npm publish', {
                cwd: buildPath,
                stdio: verbose ? 'inherit' : 'pipe',
            })

            Console.log(`✅ Successfully published ${name}`)
        }
    } catch (error) {
        Console.error(`❌ Failed to publish ${name}:`, error)
        throw error
    }
}

async function checkPackageExists(packageName: string): Promise<boolean> {
    try {
        execSync(`npm view ${packageName} version`, { stdio: 'pipe' })
        return true
    } catch {
        return false
    }
}
