import '../../configuration/Sky.Slice.global'
import { readdirSync, statSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import skyPath from './skyPath'

export interface DeployableSlice {
    path: string
    name: string
    config: Sky.Slice
}

/**
 * Находит все слайсы с slice.json файлами для деплоя на NPM
 */
export default function findDeployableSlices(): DeployableSlice[] {
    const slices: DeployableSlice[] = []

    // Сканируем все папки в корне проекта
    const entries = readdirSync(skyPath, { withFileTypes: true })

    for (const entry of entries) {
        if (!entry.isDirectory()) continue

        const slicePath = entry.name
        const fullPath = join(skyPath, slicePath)
        const sliceJsonPath = join(fullPath, 'slice.json')

        // Проверяем наличие slice.json
        if (!existsSync(sliceJsonPath)) continue

        try {
            // Читаем и парсим slice.json
            const configContent = readFileSync(sliceJsonPath, 'utf-8')
            const config = JSON.parse(configContent) as Sky.Slice

            slices.push({
                path: slicePath,
                name: config.name || `@sky-modules/${slicePath}`,
                config
            })
        } catch (error) {
            console.warn(`⚠️  Failed to parse slice.json in ${slicePath}:`, error)
        }
    }

    return slices
}