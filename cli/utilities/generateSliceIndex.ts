import 'sky/configuration/Sky.Slice.global'
import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

import Console from './Console'
import skyPath from './skyPath'

// Supported file extensions for modules
const MODULE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

/**
 * Check if module file exists with any supported extension
 */
function moduleFileExists(modulePath: string): boolean {
    return MODULE_EXTENSIONS.some(ext => existsSync(`${modulePath}${ext}`))
}

export default function generateSliceIndex(slicePath: string): string {
    const sliceJsonPath = join(skyPath, slicePath, 'slice.json')

    if (!existsSync(sliceJsonPath)) {
        throw new Error(`slice.json not found in ${slicePath}`)
    }

    const sliceConfig: Sky.Slice = JSON.parse(readFileSync(sliceJsonPath, 'utf-8'))
    const modules = sliceConfig.modules || []

    if (modules.length === 0) {
        throw new Error(`No modules specified in slice.json for ${slicePath}`)
    }

    const exports: string[] = []
    const sliceDir = join(skyPath, slicePath)

    for (const moduleName of modules) {
        const modulePath = join(sliceDir, moduleName)

        if (!existsSync(modulePath) && !moduleFileExists(modulePath)) {
            Console.warn(`⚠️  Module ${moduleName} not found in ${slicePath}`)
            continue
        }

        if (existsSync(modulePath) && statSync(modulePath).isDirectory()) {
            // Check for index file with any supported extension
            const indexExists = MODULE_EXTENSIONS.some(ext =>
                existsSync(join(modulePath, `index${ext}`))
            )

            if (indexExists) {
                exports.push(`export * from './${moduleName}'`)
            } else {
                // Check for any module files in directory
                const files = readdirSync(modulePath).filter(f => {
                    const hasValidExt = MODULE_EXTENSIONS.some(ext => f.endsWith(ext))
                    const isNotTest = !f.includes('.test.') && !f.includes('.spec.')
                    return hasValidExt && isNotTest
                })

                if (files.length > 0) {
                    exports.push(`export * from './${moduleName}'`)
                }
            }
        } else if (moduleFileExists(modulePath)) {
            exports.push(`export * from './${moduleName}'`)
        }
    }

    if (exports.length === 0) {
        throw new Error(`No valid modules found for slice ${slicePath}`)
    }

    // Генерируем content
    const header = `// Auto-generated index file for @sky-modules/${slicePath}\n// Generated from slice.json configuration\n\n`

    return header + exports.join('\n') + '\n'
}
