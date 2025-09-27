import { execSync } from 'child_process'
import { join } from 'path'
import { Argv } from 'yargs'

import findDeployableSlices from './utilities/findDeployableSlices'
import buildSlice from './utilities/buildSlice'
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
                    console.error('❌ Publish failed:', error)
                    process.exit(1)
                }
            }
        )
        .completion('completion', 'Generate completion for terminal')
}

async function publishSlices(args: PublishArgs): Promise<void> {
    const { slice, dryRun, versionBump, verbose } = args

    console.log('🚀 Starting slice publishing...')

    // Check npm authentication
    if (!dryRun) {
        try {
            execSync('npm whoami', { stdio: 'pipe' })
        } catch {
            console.error('❌ Not logged in to npm. Run: npm login')
            return
        }
    }

    // Get list of slices to publish
    const allSlices = findDeployableSlices()
    const slicesToPublish = slice ? allSlices.filter(s => s.path === slice) : allSlices

    if (slicesToPublish.length === 0) {
        console.log('ℹ️  No slices found to publish')
        return
    }

    console.log(`📦 Found ${slicesToPublish.length} slice(s) to publish:`)
    slicesToPublish.forEach(s => console.log(`   • ${s.name} (${s.path})`))

    // Bump version if specified
    if (versionBump && !dryRun) {
        console.log(`📈 Bumping version: ${versionBump}`)
        execSync(`npm version ${versionBump} --no-git-tag-version`, {
            cwd: skyPath,
            stdio: verbose ? 'inherit' : 'pipe',
        })
    }

    // Publish each slice
    for (const sliceInfo of slicesToPublish) {
        await publishSlice(sliceInfo, { dryRun, verbose })
    }

    console.log('✅ Publishing completed!')
}

async function publishSlice(
    sliceInfo: { path: string; name: string },
    options: { dryRun?: boolean; verbose?: boolean }
): Promise<void> {
    const { path: slicePath, name } = sliceInfo
    const { dryRun, verbose } = options

    console.log(`\n🔨 Building slice: ${name}`)

    try {
        // Build the slice
        await buildSlice({
            slicePath,
            outputDir: '.dev/slices',
            verbose,
        })

        const buildPath = join(skyPath, '.dev/slices', slicePath)

        if (dryRun) {
            console.log(`✅ Dry run successful for ${name}`)
            console.log(`   Build path: ${buildPath}`)

            // Show what would be published
            if (verbose) {
                try {
                    const result = execSync('npm pack --dry-run', {
                        cwd: buildPath,
                        encoding: 'utf8',
                    })
                    console.log('   Package contents:')
                    console.log(
                        result
                            .split('\n')
                            .map(line => `     ${line}`)
                            .join('\n')
                    )
                } catch (error) {
                    console.warn('   Could not preview package contents')
                }
            }
        } else {
            // Check if package exists
            const packageExists = await checkPackageExists(name)

            if (packageExists) {
                console.log(`📦 Publishing update for ${name}`)
            } else {
                console.log(`🆕 Publishing new package ${name}`)
            }

            // Publish package
            execSync('npm publish', {
                cwd: buildPath,
                stdio: verbose ? 'inherit' : 'pipe',
            })

            console.log(`✅ Successfully published ${name}`)
        }
    } catch (error) {
        console.error(`❌ Failed to publish ${name}:`, error)
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
