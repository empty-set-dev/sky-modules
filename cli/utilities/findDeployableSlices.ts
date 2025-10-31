import '@sky-modules/cli/configuration/Sky.Slice.namespace'
import { readdirSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'

import Console from './Console'
import workspaceRoot from './workspaceRoot'

export interface DeployableSlice {
    path: string
    name: string
    config: Sky.Slice
}

/**
 * Find all slices with slice.json files for NPM deployment
 */
export default function findDeployableSlices(): DeployableSlice[] {
    if (workspaceRoot == null) {
        throw new Error('Sky workspace not found')
    }

    const slices: DeployableSlice[] = []

    // Scan all folders in project root
    const entries = readdirSync(workspaceRoot, { withFileTypes: true })

    for (const entry of entries) {
        if (!entry.isDirectory()) continue

        // Skip hidden folders and special directories
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'docs') {
            continue
        }

        const slicePath = entry.name
        const fullPath = join(workspaceRoot, slicePath)
        const sliceJsonPath = join(fullPath, 'slice.json')

        // Check for slice.json existence
        if (!existsSync(sliceJsonPath)) continue

        try {
            // Read and parse slice.json
            const configContent = readFileSync(sliceJsonPath, 'utf-8')
            const config = JSON.parse(configContent) as Sky.Slice

            slices.push({
                path: slicePath,
                name: config.name,
                config,
            })
        } catch (error) {
            Console.warn(`⚠️  Failed to parse slice.json in ${slicePath}:`, error)
        }
    }

    return slices
}
