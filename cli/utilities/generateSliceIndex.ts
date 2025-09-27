import 'sky/configuration/Sky.Slice.global'
import { readFileSync, existsSync, readdirSync, statSync } from 'fs'
import { join } from 'path'
import skyPath from './skyPath'

/**
 * Генерирует содержимое index.ts файла для слайса на основе конфигурации modules
 */
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

        // Проверяем что модуль существует (папка или файл)
        if (!existsSync(modulePath) && !existsSync(`${modulePath}.ts`)) {
            console.warn(`⚠️  Module ${moduleName} not found in ${slicePath}`)
            continue
        }

        // Определяем тип экспорта
        if (existsSync(modulePath) && statSync(modulePath).isDirectory()) {
            // Папка с модулем - ищем index.ts или основной файл
            const moduleIndexPath = join(modulePath, 'index.ts')
            if (existsSync(moduleIndexPath)) {
                exports.push(`export * from './${moduleName}'`)
            } else {
                // Ищем файлы в папке
                const files = readdirSync(modulePath).filter(f => f.endsWith('.ts') && !f.endsWith('.test.ts'))
                if (files.length > 0) {
                    exports.push(`export * from './${moduleName}'`)
                }
            }
        } else if (existsSync(`${modulePath}.ts`)) {
            // Отдельный файл
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