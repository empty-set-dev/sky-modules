import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import { ArgumentsCamelCase } from 'yargs'

import buildSlice from './utilities/buildSlice'
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

    console.log('🚀 Starting slice deployment process...')

    if (dryRun) {
        console.log('🔍 DRY RUN MODE - No actual deployment will occur')
    }

    // Find deployable slices
    const slices = findDeployableSlices()
    const slicesToDeploy = targetSlice ? slices.filter(s => s.path === targetSlice) : slices

    if (slicesToDeploy.length === 0) {
        if (targetSlice) {
            console.error(`❌ Slice "${targetSlice}" not found`)
            process.exit(1)
        } else {
            console.log('ℹ️  No deployable slices found')
            return
        }
    }

    console.log(`📦 Found ${slicesToDeploy.length} slice(s) to deploy:`)
    slicesToDeploy.forEach(slice => {
        console.log(`  • ${slice.config.name || `@sky-modules/${slice.path}`}`)
    })

    if (workspaceRoot == null) {
        throw Error('Sky workspace not found')
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

    console.log('✅ Slice deployment completed!')
}

async function deploySlice(
    slice: { path: string; config: any },
    deployDir: string,
    options: { dryRun?: boolean; versionBump?: 'major' | 'minor' | 'patch' | undefined }
): Promise<void> {
    const { path: slicePath, config } = slice
    const { dryRun, versionBump } = options

    console.log(`\n📦 Processing slice: ${slicePath}`)

    const sliceDeployDir = join(deployDir, slicePath)

    try {
        // Step 1: Build slice
        console.log('🔨 Building slice...')
        await buildSlice({ slicePath, outputDir: deployDir, verbose: true })

        // Step 2: Check npm authentication
        if (!dryRun) {
            console.log('🔐 Checking npm authentication...')
            try {
                await runShell('npm whoami', { cwd: sliceDeployDir })
            } catch (error) {
                console.error('❌ Not authenticated with npm. Run: npm login')
                throw error
            }
        }

        // Step 3: Check if package already exists
        const packageName = config.name || `@sky-modules/${slicePath}`

        if (!dryRun) {
            console.log(`🔍 Checking if package ${packageName} exists...`)
            try {
                await runShell(`npm view ${packageName} version`, { cwd: sliceDeployDir })
                console.log(`📦 Package ${packageName} already exists on npm`)
            } catch (error) {
                console.log(`📦 Package ${packageName} is new`)
            }
        }

        // Step 4: Publish package
        if (dryRun) {
            console.log(`🔍 DRY RUN: Would publish ${packageName}`)
            console.log(`🔍 DRY RUN: Package directory: ${sliceDeployDir}`)
        } else {
            console.log(`📤 Publishing ${packageName}...`)
            await runShell('npm publish --access public', { cwd: sliceDeployDir })
            console.log(`✅ Successfully published ${packageName}!`)
        }
    } catch (error) {
        console.error(`❌ Failed to deploy slice ${slicePath}:`, error)
        throw error
    }
}
