import 'sky/configuration/Sky.Slice.global'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import skyPath from './skyPath'
import findDeployableSlices from './findDeployableSlices'

interface ReadmeContent {
    title: string
    content: string
    slice: string
    module: string
}

/**
 * Generate unified README.md and README.ru.md from all module documentation
 */
export async function generateReadme(): Promise<void> {
    console.log('📚 Generating unified README from module documentation...')

    const slices = findDeployableSlices()
    const englishContent: ReadmeContent[] = []
    const russianContent: ReadmeContent[] = []

    // Collect documentation from all modules
    for (const slice of slices) {
        for (const moduleName of slice.config.modules || []) {
            const moduleDir = join(skyPath, slice.path, moduleName)

            // Check for English documentation
            const englishDocs = [
                join(moduleDir, 'README.md'),
                join(moduleDir, `${moduleName}.md`),
                join(moduleDir, 'index.md')
            ]

            for (const docPath of englishDocs) {
                if (existsSync(docPath)) {
                    const content = readFileSync(docPath, 'utf-8')
                    englishContent.push({
                        title: moduleName,
                        content: processContentForReadme(content, moduleName),
                        slice: slice.path,
                        module: moduleName
                    })
                    break
                }
            }

            // Check for Russian documentation
            const russianDocs = [
                join(moduleDir, 'README.ru.md'),
                join(moduleDir, `${moduleName}.ru.md`),
                join(moduleDir, 'index.ru.md')
            ]

            for (const docPath of russianDocs) {
                if (existsSync(docPath)) {
                    const content = readFileSync(docPath, 'utf-8')
                    russianContent.push({
                        title: moduleName,
                        content: processContentForReadme(content, moduleName),
                        slice: slice.path,
                        module: moduleName
                    })
                    break
                }
            }
        }
    }

    // Generate unified READMEs
    await generateUnifiedReadme(englishContent, 'README.md', false)
    await generateUnifiedReadme(russianContent, 'README.ru.md', true)

    console.log('✅ Unified README files generated successfully!')
}

/**
 * Process markdown content for inclusion in unified README
 */
function processContentForReadme(content: string, moduleName: string): string {
    // Remove title if it's just the module name
    let processed = content.replace(/^# \w+\s*\n/m, '')

    // Remove VitePress-specific divs
    processed = processed.replace(/<div class="sky-gradient-text"[^>]*>[\s\S]*?<\/div>/g, '')

    // Remove installation sections (will be in main README)
    processed = processed.replace(/## Installation[\s\S]*?(?=##|$)/m, '')

    // Adjust heading levels (shift down by 1)
    processed = processed.replace(/^(#{1,5}) /gm, '##$1 ')

    // Clean up extra whitespace
    processed = processed.replace(/\n{3,}/g, '\n\n').trim()

    return processed
}

/**
 * Generate unified README file
 */
async function generateUnifiedReadme(
    contents: ReadmeContent[],
    filename: string,
    isRussian: boolean
): Promise<void> {
    const lang = isRussian ? 'ru' : 'en'

    const header = isRussian ? `# Sky Modules

Мощные TypeScript утилиты для современной разработки

## Установка

\`\`\`bash
npm install @sky-modules/core
\`\`\`

## Использование

\`\`\`typescript
import { mergeNamespace, globalify } from '@sky-modules/core'

// Слияние объектов с типобезопасностью
const result = mergeNamespace(obj1, obj2)

// Добавление в глобальную область
globalify({ myUtility: someFunction })
\`\`\`

## Модули

` : `# Sky Modules

Powerful TypeScript utility modules for modern development

## Installation

\`\`\`bash
npm install @sky-modules/core
\`\`\`

## Usage

\`\`\`typescript
import { mergeNamespace, globalify } from '@sky-modules/core'

// Merge objects with type safety
const result = mergeNamespace(obj1, obj2)

// Add to global namespace
globalify({ myUtility: someFunction })
\`\`\`

## Modules

`

    let readme = header

    // Group content by slice
    const sliceGroups = contents.reduce((groups, item) => {
        if (!groups[item.slice]) {
            groups[item.slice] = []
        }
        groups[item.slice].push(item)
        return groups
    }, {} as Record<string, ReadmeContent[]>)

    // Add table of contents
    const tocHeader = isRussian ? '\n### Содержание\n\n' : '\n### Table of Contents\n\n'
    readme += tocHeader

    for (const [sliceName, items] of Object.entries(sliceGroups)) {
        const sliceTitle = sliceName === 'core' ?
            (isRussian ? 'Основные модули' : 'Core Modules') :
            sliceName

        readme += `- **${sliceTitle}**\n`
        for (const item of items) {
            readme += `    - [${item.title}](#${item.title.toLowerCase()})\n`
        }
        readme += '\n'
    }

    // Add detailed documentation
    for (const [sliceName, items] of Object.entries(sliceGroups)) {
        const sliceTitle = sliceName === 'core' ?
            (isRussian ? 'Основные модули' : 'Core Modules') :
            sliceName

        readme += `\n## ${sliceTitle}\n\n`

        for (const item of items) {
            // Add back to navigation link and source code link at the beginning
            const backLinkTop = isRussian ?
                '[← Назад к оглавлению](#содержание)' :
                '[← Back to Table of Contents](#table-of-contents)'

            const sourceCodeLink = isRussian ?
                ` • [Исходный код](https://github.com/empty-set-dev/sky-modules/tree/main/${item.slice}/${item.module})` :
                ` • [Source Code](https://github.com/empty-set-dev/sky-modules/tree/main/${item.slice}/${item.module})`

            readme += `### ${item.title}\n\n`
            readme += backLinkTop + sourceCodeLink + '\n\n'
            readme += item.content

            // Add back to navigation link at the end
            const backLinkBottom = isRussian ?
                '\n\n[← Назад к оглавлению](#содержание)\n\n' :
                '\n\n[← Back to Table of Contents](#table-of-contents)\n\n'
            readme += backLinkBottom
            readme += '---\n\n'
        }
    }

    // Add footer
    const footer = isRussian ? `
## Разработка

\`\`\`bash
# Клонирование репозитория
git clone https://github.com/empty-set-dev/sky-modules.git
cd sky-modules

# Установка зависимостей
pnpm install

# Запуск разработки
pnpm dev
\`\`\`

## Документация

- 📖 [Полная документация](https://empty-set-dev.github.io/sky-modules)
- 🎮 [Примеры использования](https://empty-set-dev.github.io/sky-modules/examples)
- 🛠️ [API справочник](https://empty-set-dev.github.io/sky-modules/modules)

## Лицензия

ISC License - смотрите [LICENSE](LICENSE) файл для деталей.

---

Создано с ❤️ командой Empty Set Dev
` : `
## Development

\`\`\`bash
# Clone the repository
git clone https://github.com/empty-set-dev/sky-modules.git
cd sky-modules

# Install dependencies
pnpm install

# Start development
pnpm dev
\`\`\`

## Documentation

- 📖 [Full Documentation](https://empty-set-dev.github.io/sky-modules)
- 🎮 [Usage Examples](https://empty-set-dev.github.io/sky-modules/examples)
- 🛠️ [API Reference](https://empty-set-dev.github.io/sky-modules/modules)

## License

ISC License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by Empty Set Dev
`

    readme += footer

    // Write the file
    const outputPath = join(skyPath, filename)
    writeFileSync(outputPath, readme)

    console.log(`📄 Generated ${filename}`)
}

export default generateReadme