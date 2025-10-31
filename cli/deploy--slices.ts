import './configuration/Sky.Slice.namespace'

import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import { ArgumentsCamelCase } from 'yargs'

import { ExitCode } from './constants'
import buildSlice from './utilities/buildSlice'
import Console from './utilities/Console'
import findDeployableSlices from './utilities/findDeployableSlices'
import runShell from './utilities/run'
import workspaceRoot from './utilities/workspaceRoot'

interface DeployOptions {
    slice?: string
    dryRun?: boolean
    versionBump?: 'major' | 'minor' | 'patch'
}

export default async function deploySlices(args: ArgumentsCamelCase<DeployOptions>): Promise<void> {
    const { slice: targetSlice, dryRun = false, versionBump } = args

    Console.log('🚀 Starting slice deployment process...')

    if (dryRun) {
        Console.log('🔍 DRY RUN MODE - No actual deployment will occur')
    }

    // Find deployable slices
    const slices = findDeployableSlices()
    const slicesToDeploy = targetSlice ? slices.filter(s => s.path === targetSlice) : slices

    if (slicesToDeploy.length === 0) {
        if (targetSlice) {
            Console.error(`❌ Slice "${targetSlice}" not found`)
            process.exit(ExitCode.CONFIG_ERROR)
        } else {
            Console.log('ℹ️  No deployable slices found')
            return
        }
    }

    Console.log(`📦 Found ${slicesToDeploy.length} slice(s) to deploy:`)
    slicesToDeploy.forEach(slice => {
        Console.log(`  • ${slice.config.name || `@sky-modules/${slice.path}`}`)
    })

    if (workspaceRoot == null) {
        throw new Error('Sky workspace not found')
    }

    // Create deployment directory
    const deployDir = join(workspaceRoot, '.dev', 'slices')

    if (!existsSync(deployDir)) {
        mkdirSync(deployDir, { recursive: true })
    }

    // Process each slice
    for (const slice of slicesToDeploy) {
        await deploySlice(slice, deployDir, { dryRun, versionBump })
    }

    Console.log('✅ Slice deployment completed!')
}

async function deploySlice(
    slice: { path: string; config: Sky.Slice },
    deployDir: string,
    options: { dryRun?: boolean; versionBump?: 'major' | 'minor' | 'patch' | undefined }
): Promise<void> {
    const { path: slicePath, config } = slice
    const { dryRun } = options

    Console.log(`\n📦 Processing slice: ${slicePath}`)

    const sliceDeployDir = join(deployDir, slicePath)

    try {
        // Step 1: Build slice
        Console.log('🔨 Building slice...')
        await buildSlice({ slicePath, outputDir: deployDir, verbose: true })

        // Step 2: Check npm authentication
        if (!dryRun) {
            Console.log('🔐 Checking npm authentication...')
            try {
                await runShell('npm whoami', { cwd: sliceDeployDir })
            } catch {
                Console.error('❌ Not authenticated with npm. Run: npm login')
                throw new Error()
            }
        }

        // Step 3: Check if package already exists
        const packageName = config.name || `@sky-modules/${slicePath}`

        if (!dryRun) {
            Console.log(`🔍 Checking if package ${packageName} exists...`)
            try {
                await runShell(`npm view ${packageName} version`, { cwd: sliceDeployDir })
                Console.log(`📦 Package ${packageName} already exists on npm`)
            } catch {
                Console.log(`📦 Package ${packageName} is new`)
            }
        }

        // Step 4: Publish package
        if (dryRun) {
            Console.log(`🔍 DRY RUN: Would publish ${packageName}`)
            Console.log(`🔍 DRY RUN: Package directory: ${sliceDeployDir}`)
        } else {
            Console.log(`📤 Publishing ${packageName}...`)
            await runShell('npm publish --access public', { cwd: sliceDeployDir })
            Console.log(`✅ Successfully published ${packageName}!`)
        }
    } catch (error) {
        Console.error(`❌ Failed to deploy slice ${slicePath}:`, error)
        throw new Error()
    }
}
