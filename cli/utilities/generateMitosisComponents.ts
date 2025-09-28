import { promises as fs } from 'fs'
import path from 'path'

import {
    parseJsx,
    componentToReact,
    componentToVue,
    componentToSolid,
    componentToQwik,
    componentToSvelte,
    componentToAngular,
    componentToCustomElement,
    componentToStencil,
    componentToLit,
    componentToReactNative,
    componentToPreact,
    componentToRsc,
    componentToHtml,
    componentToLiquid,
    componentToTemplate,
    componentToMarko,
    componentToSwift,
    componentToAlpine,
    componentToTaro,
} from '@builder.io/mitosis'

import Console from './Console'

const COMPONENTS_DIR = 'universal/components'
const OUTPUT_DIR = 'generated-components'

const generators = {
    react: componentToReact,
    vue: componentToVue,
    solid: componentToSolid,
    qwik: componentToQwik,
    svelte: componentToSvelte,
    angular: componentToAngular,
    customElement: componentToCustomElement,
    stencil: componentToStencil,
    lit: componentToLit,
    reactNative: componentToReactNative,
    preact: componentToPreact,
    rsc: componentToRsc,
    html: componentToHtml,
    liquid: componentToLiquid,
    template: componentToTemplate,
    marko: componentToMarko,
    swift: componentToSwift,
    alpine: componentToAlpine,
    taro: componentToTaro,
}

export default async function generateComponents(): Promise<void> {
    try {
        Console.log('🚀 Generating universal components for ALL targets!')

        // Clean generated components directory
        await fs.rm(OUTPUT_DIR, { recursive: true, force: true })
        await fs.mkdir(OUTPUT_DIR, { recursive: true })

        // Получаем список .lite.tsx файлов
        const files = await fs.readdir(COMPONENTS_DIR)
        const liteFiles = files.filter(file => file.endsWith('.lite.tsx'))

        for (const file of liteFiles) {
            const componentName = file.replace('.lite.tsx', '')
            const filePath = path.join(COMPONENTS_DIR, file)
            const source = await fs.readFile(filePath, 'utf-8')

            Console.log(
                `📦 Генерируем ${componentName} для ${Object.keys(generators).length} таргетов...`
            )

            // Парсим JSX компонент
            const mitosisComponent = parseJsx(source)

            for (const [target, generator] of Object.entries(generators)) {
                try {
                    if (!generator) {
                        Console.warn(`⚠️  Generator for ${target} not found`)
                        continue
                    }

                    // Create target directory
                    const targetDir = path.join(OUTPUT_DIR, target)
                    await fs.mkdir(targetDir, { recursive: true })

                    // Create in-memory configuration for each target
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    let options: any = {
                        typescript: true,
                        stylesType: 'styled-components',
                    }

                    if (target === 'vue') {
                        options = {
                            typescript: true,
                            stylesType: 'styled-components',
                        }
                    }

                    // Safe generator call with try-catch
                    let generatedCode: string
                    try {
                        const generatorFunction = generator(options)
                        generatedCode = generatorFunction({
                            component: mitosisComponent,
                            path: filePath,
                        })
                    } catch (error) {
                        Console.warn(
                            `⚠️  Generation error for ${target}: ${error instanceof Error ? error.message : String(error)}`
                        )
                        continue
                    }

                    const extensions: Record<string, string> = {
                        react: '.tsx',
                        rsc: '.tsx',
                        vue: '.vue',
                        solid: '.tsx',
                        qwik: '.tsx',
                        svelte: '.svelte',
                        angular: '.ts',
                        html: '.html',
                        swift: '.swift',
                        liquid: '.liquid',
                        template: '.html',
                        marko: '.marko',
                        taro: '.tsx',
                    }

                    const ext = extensions[target] || '.ts'
                    const outputPath = path.join(targetDir, `${componentName}${ext}`)

                    // Сохраняем сгенерированный код
                    await fs.writeFile(outputPath, generatedCode)

                    Console.log(`✅ ${componentName} -> ${target} (${ext})`)
                } catch (error) {
                    //@ts-expect-error
                    Console.warn(`⚠️  Пропускаем ${componentName} -> ${target}: ${error.message}`)
                }
            }
        }

        Console.log('🎉 Генерация завершена!')

        // Выводим структуру сгенерированных файлов
        Console.log('\n📁 Структура сгенерированных компонентов:')
        const targetDirs = await fs.readdir(OUTPUT_DIR)

        for (const targetDir of targetDirs) {
            const targetPath = path.join(OUTPUT_DIR, targetDir)
            const stat = await fs.stat(targetPath)

            if (stat.isDirectory()) {
                const targetFiles = await fs.readdir(targetPath)
                Console.log(`  ${targetDir}/`)

                for (const targetFile of targetFiles) {
                    Console.log(`    ${targetFile}`)
                }
            }
        }
    } catch (error) {
        Console.error('❌ Ошибка генерации:', error)
        process.exit(1)
    }
}
