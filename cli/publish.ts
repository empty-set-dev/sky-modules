import { execSync } from 'child_process'
import { join } from 'path'

import { ArgumentsCamelCase, Argv } from 'yargs'

import { ExitCode } from './constants'
import buildModule from './utilities/buildModule'
import buildSlice from './utilities/buildSlice'
import cliPath from './utilities/cliPath'
import Console from './utilities/Console'
import findDeployableModules from './utilities/findDeployableModules'
import findDeployableSlices from './utilities/findDeployableSlices'
import workspaceRoot from './utilities/workspaceRoot'

interface PublishSliceArgs {
    slice?: string
    dryRun?: boolean
    versionBump?: 'patch' | 'minor' | 'major'
    verbose?: boolean
}

interface PublishModuleArgs {
    module?: string
    dryRun?: boolean
    versionBump?: 'patch' | 'minor' | 'major'
    verbose?: boolean
}

export default function init(yargs: Argv): Argv {
    return yargs
        .demandCommand()
        .command(
            'slices [slice]',
            'Publish slices to npmjs.com',
            yargs => {
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
            async (argv: ArgumentsCamelCase<PublishSliceArgs>) => {
                try {
                    await publishSlices(argv)
                } catch (error) {
                    Console.error('❌ Publish failed:', error)
                    process.exit(ExitCode.DEPLOYMENT_ERROR)
                }
            }
        )
        .command(
            'modules [module]',
            'Publish modules to npmjs.com',
            yargs => {
                return yargs
                    .positional('module', {
                        type: 'string',
                        describe:
                            'Specific module to publish (optional, publishes all if not specified)',
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
            async (argv: ArgumentsCamelCase<PublishModuleArgs>) => {
                try {
                    await publishModules(argv)
                } catch (error) {
                    Console.error('❌ Publish failed:', error)
                    process.exit(ExitCode.DEPLOYMENT_ERROR)
                }
            }
        )
        .completion('completion', 'Generate completion for terminal')
}

async function publishSlices(args: PublishSliceArgs): Promise<void> {
    if (workspaceRoot == null) {
        throw Error('Sky workspace not found')
    }

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
            cwd: workspaceRoot,
            stdio: verbose ? 'inherit' : 'pipe',
        })
    }

    // Publish each slice
    for (const sliceInfo of slicesToPublish) {
        await publishSlice(sliceInfo, { dryRun: dryRun || false, verbose: verbose || false })
    }

    Console.log('✅ Publishing completed!')
}

async function publishSlice(
    sliceInfo: { path: string; name: string },
    options: { dryRun?: boolean; verbose?: boolean }
): Promise<void> {
    if (workspaceRoot == null) {
        throw Error('Sky workspace not found')
    }

    const { path: slicePath, name } = sliceInfo
    const { dryRun, verbose } = options

    Console.log(`\n🔨 Building slice: ${name}`)

    try {
        // Build the slice
        await buildSlice({
            slicePath,
            outputDir: '.dev/slices',
            verbose: verbose || false,
        })

        const buildPath = join(cliPath, '.dev/slices', slicePath)

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
                    error
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

async function publishModules(args: PublishModuleArgs): Promise<void> {
    if (workspaceRoot == null) {
        throw Error('Sky workspace not found')
    }

    const { module, dryRun, versionBump, verbose } = args

    Console.log('🚀 Starting module publishing...')

    // Check npm authentication
    if (!dryRun) {
        try {
            execSync('npm whoami', { stdio: 'pipe' })
        } catch {
            Console.error('❌ Not logged in to npm. Run: npm login')
            return
        }
    }

    // Get list of modules to publish
    const allModules = findDeployableModules()
    const modulesToPublish = module ? allModules.filter(m => m.path === module) : allModules

    if (modulesToPublish.length === 0) {
        Console.log('ℹ️  No modules found to publish')
        return
    }

    Console.log(`📦 Found ${modulesToPublish.length} module(s) to publish:`)
    modulesToPublish.forEach(m => Console.log(`   • ${m.name} (${m.path})`))

    // Bump version if specified
    if (versionBump && !dryRun) {
        Console.log(`📈 Bumping version: ${versionBump}`)
        execSync(`npm version ${versionBump} --no-git-tag-version`, {
            cwd: cliPath,
            stdio: verbose ? 'inherit' : 'pipe',
        })
    }

    // Publish each module
    for (const moduleInfo of modulesToPublish) {
        await publishModule(moduleInfo, { dryRun: dryRun || false, verbose: verbose || false })
    }

    Console.log('✅ Publishing completed!')
}

async function publishModule(
    moduleInfo: { path: string; name: string },
    options: { dryRun?: boolean; verbose?: boolean }
): Promise<void> {
    if (workspaceRoot == null) {
        throw Error('Sky workspace not found')
    }

    const { path: modulePath, name } = moduleInfo
    const { dryRun, verbose } = options

    Console.log(`\n🔨 Building module: ${name}`)

    try {
        // Build the module
        await buildModule({
            modulePath,
            outputDir: '.dev/modules',
            verbose: verbose || false,
        })

        const buildPath = join(cliPath, '.dev/modules', modulePath)

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
                    error
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
