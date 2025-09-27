import 'sky/configuration/Sky.Slice.global'
import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import skyPath from './skyPath'

/**
 * Generates global.ts file that imports all .global.ts files from the slice modules
 */
export default function generateSliceGlobal(slicePath: string): string {
    const sliceJsonPath = join(skyPath, slicePath, 'slice.json')

    if (!existsSync(sliceJsonPath)) {
        throw new Error(`slice.json not found in ${slicePath}`)
    }

    const sliceConfig: Sky.Slice = JSON.parse(readFileSync(sliceJsonPath, 'utf-8'))
    const modules = sliceConfig.modules || []

    if (modules.length === 0) {
        return '// No modules to import\n'
    }

    const imports: string[] = []
    const sliceDir = join(skyPath, slicePath)

    for (const moduleName of modules) {
        const modulePath = join(sliceDir, moduleName)

        // Check if module is a directory or file
        if (existsSync(modulePath) && statSync(modulePath).isDirectory()) {
            // Directory module - check for global.ts inside
            const globalPath = join(modulePath, 'global.ts')
            if (existsSync(globalPath)) {
                imports.push(`import './${moduleName}/global'`)
            }
        }

        // Check for .global.ts file (either moduleName.global.ts or in moduleName/ folder)
        const globalFileName = `${moduleName}.global.ts`
        const globalFilePath = join(sliceDir, globalFileName)

        if (existsSync(globalFilePath)) {
            imports.push(`import './${moduleName}.global'`)
        }
    }

    if (imports.length === 0) {
        return '// No global files found\n'
    }

    // Generate content
    const header = `// Auto-generated global imports for @sky-modules/${slicePath}\n// Generated from slice.json modules\n\n`

    return header + imports.join('\n') + '\n'
}