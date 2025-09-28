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

const COMPONENTS_DIR = 'universal-components'
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

async function generateComponents() {
    try {
        console.log('🚀 Генерируем универсальные компоненты для ВСЕХ таргетов!')

        // Очищаем папку с сгенерированными компонентами
        await fs.rm(OUTPUT_DIR, { recursive: true, force: true })
        await fs.mkdir(OUTPUT_DIR, { recursive: true })

        // Получаем список .lite.tsx файлов
        const files = await fs.readdir(COMPONENTS_DIR)
        const liteFiles = files.filter(file => file.endsWith('.lite.tsx'))

        for (const file of liteFiles) {
            const componentName = file.replace('.lite.tsx', '')
            const filePath = path.join(COMPONENTS_DIR, file)
            const source = await fs.readFile(filePath, 'utf-8')

            console.log(
                `📦 Генерируем ${componentName} для ${Object.keys(generators).length} таргетов...`
            )

            // Парсим JSX компонент
            const mitosisComponent = parseJsx(source)

            for (const [target, generator] of Object.entries(generators)) {
                try {
                    if (!generator) {
                        console.warn(`⚠️  Генератор для ${target} не найден`)
                        continue
                    }

                    // Создаем папку для таргета
                    const targetDir = path.join(OUTPUT_DIR, target)
                    await fs.mkdir(targetDir, { recursive: true })

                    // Генерируем код для таргета
                    let options = { typescript: true }

                    if (target === 'react') {
                        options.stylesType = 'styled-jsx'
                    }

                    // Vue не поддерживает namePrefix и некоторые другие опции
                    if (target === 'vue') {
                        options = {}
                    }

                    const generatorFunction = generator(options)

                    const generatedCode = generatorFunction({
                        component: mitosisComponent,
                        path: filePath,
                    })

                    // Определяем расширение файла
                    const extensions = {
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

                    console.log(`✅ ${componentName} -> ${target} (${ext})`)
                } catch (error) {
                    console.warn(`⚠️  Пропускаем ${componentName} -> ${target}: ${error.message}`)
                }
            }
        }

        console.log('🎉 Генерация завершена!')

        // Выводим структуру сгенерированных файлов
        console.log('\n📁 Структура сгенерированных компонентов:')
        const targetDirs = await fs.readdir(OUTPUT_DIR)

        for (const targetDir of targetDirs) {
            const targetPath = path.join(OUTPUT_DIR, targetDir)
            const stat = await fs.stat(targetPath)

            if (stat.isDirectory()) {
                const targetFiles = await fs.readdir(targetPath)
                console.log(`  ${targetDir}/`)

                for (const targetFile of targetFiles) {
                    console.log(`    ${targetFile}`)
                }
            }
        }
    } catch (error) {
        console.error('❌ Ошибка генерации:', error)
        process.exit(1)
    }
}

generateComponents()
