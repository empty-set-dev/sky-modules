import 'sky/configuration/Sky.Slice.global'
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, rmSync } from 'fs'
import { join, relative } from 'path'

import Console from './Console'
import findDeployableSlices from './findDeployableSlices'
import skyPath from './skyPath'

interface NavItem {
    text: string
    link: string
}

interface SidebarGroup {
    text: string
    items: NavItem[]
}

/**
 * Auto-generate VitePress documentation from .md files in modules
 */
export async function generateDocsFromMarkdown(): Promise<void> {
    Console.log('📚 Generating VitePress docs from markdown files...')

    const slices = findDeployableSlices()
    const docsDir = join(skyPath, 'docs')
    const modulesDir = join(docsDir, 'modules')

    // Clean modules directory but preserve index.md
    const indexPath = join(modulesDir, 'index.md')
    let indexContent = ''

    if (existsSync(indexPath)) {
        indexContent = readFileSync(indexPath, 'utf-8')
    }

    if (existsSync(modulesDir)) {
        rmSync(modulesDir, { recursive: true, force: true })
    }

    // Create folder structure
    mkdirSync(modulesDir, { recursive: true })

    // Restore index.md if it existed
    if (indexContent) {
        writeFileSync(indexPath, indexContent)
    }

    mkdirSync(join(docsDir, 'guide'), { recursive: true })

    // Create Russian locale structure and copy main pages
    const ruDir = join(docsDir, 'ru')
    mkdirSync(ruDir, { recursive: true })

    // Copy main README.ru.md as Russian index
    const mainReadmeRu = join(skyPath, 'README.ru.md')

    if (existsSync(mainReadmeRu)) {
        const ruIndexPath = join(ruDir, 'index.md')
        let ruContent = readFileSync(mainReadmeRu, 'utf-8')
        // Process content for VitePress
        ruContent = ruContent.replace(/\[([^\]]+)\]\(#([^)]+)\)/g, '[$1](/ru/modules/core/$2)')
        writeFileSync(ruIndexPath, ruContent)
        Console.log(`📄 Created Russian index: ${relative(skyPath, ruIndexPath)}`)
    }

    // Create Russian modules index
    const ruModulesDir = join(ruDir, 'modules')
    mkdirSync(ruModulesDir, { recursive: true })
    const ruModulesIndex = join(ruModulesDir, 'index.md')
    const ruModulesContent = `# Модули

Обзор всех доступных модулей в Sky Modules.

## Core Модули

### [Array](/ru/modules/core/Array)
Расширения для встроенного типа Array с дополнительными утилитарными методами.

- \`last()\` - получить последний элемент
- \`remove()\` - удалить элемент
- \`shuffle()\` - перемешать массив на месте
- \`toShuffled()\` - создать перемешанную копию

### [mergeNamespace](/ru/modules/core/mergeNamespace)
Утилита для безопасного слияния пространств имен с типобезопасностью.

- Глубокое слияние объектов
- Сохранение типов TypeScript
- Обработка вложенных структур`

    writeFileSync(ruModulesIndex, ruModulesContent)
    Console.log(`📄 Created Russian modules index: ${relative(skyPath, ruModulesIndex)}`)

    const sidebar: Record<string, SidebarGroup[]> = {}

    // Process each slice
    for (const slice of slices) {
        const sliceModules = await processSlice(slice.path, slice.config)

        if (sliceModules.length > 0) {
            sidebar[`/modules/${slice.path}/`] = [
                {
                    text: `${slice.path} Modules`,
                    items: sliceModules,
                },
            ]
        }
    }

    // Generate general module navigation
    const allModules = await generateModuleIndex(slices)
    sidebar['/modules/'] = allModules

    // Update VitePress config
    await updateVitePressConfig(sidebar)

    Console.log('✅ VitePress documentation generated successfully!')
}

/**
 * Process slice and copy .md files
 */
async function processSlice(slicePath: string, slice: Sky.Slice): Promise<NavItem[]> {
    const sourceDir = join(skyPath, slicePath)
    const targetDir = join(skyPath, 'docs', 'modules', slicePath)

    mkdirSync(targetDir, { recursive: true })

    const modules: NavItem[] = []

    // Look for .md files in module folders
    for (const moduleName of slice.modules || []) {
        const modulePath = join(sourceDir, moduleName)

        if (existsSync(modulePath) && statSync(modulePath).isDirectory()) {
            // Look for README.md or moduleName.md in module folder
            const possibleDocs = [
                join(modulePath, 'README.md'),
                join(modulePath, 'README.ru.md'),
                join(modulePath, `${moduleName}.md`),
                join(modulePath, `${moduleName}.ru.md`),
                join(modulePath, 'index.md'),
                join(modulePath, 'index.ru.md'),
            ]

            // Process both English and Russian docs
            const processedDocs = new Set<string>()

            for (const docPath of possibleDocs) {
                if (existsSync(docPath)) {
                    const isRussian = docPath.includes('.ru.md')
                    const targetFileName = isRussian ? `${moduleName}.ru.md` : `${moduleName}.md`
                    const targetPath = join(targetDir, targetFileName)

                    // Skip if already processed this language
                    const langKey = `${moduleName}-${isRussian ? 'ru' : 'en'}`

                    if (processedDocs.has(langKey)) continue

                    // Copy and process file
                    let content = readFileSync(docPath, 'utf-8')
                    content = processMarkdownContent(content, moduleName, slicePath)

                    writeFileSync(targetPath, content)
                    processedDocs.add(langKey)

                    // Also create locale-specific versions for Russian
                    if (isRussian) {
                        const ruDir = join(skyPath, 'docs', 'ru', 'modules', slicePath)
                        mkdirSync(ruDir, { recursive: true })
                        const ruTargetPath = join(ruDir, `${moduleName}.md`)
                        writeFileSync(ruTargetPath, content)
                        Console.log(`📄 Created Russian locale: ${relative(skyPath, ruTargetPath)}`)
                    }

                    // Only add to navigation once (prefer English)
                    if (!isRussian && !modules.some(m => m.text === moduleName)) {
                        modules.push({
                            text: moduleName,
                            link: `/modules/${slicePath}/${moduleName}`,
                        })
                    }

                    Console.log(
                        `📄 Copied docs: ${relative(skyPath, docPath)} → ${relative(skyPath, targetPath)}`
                    )
                }
            }
        }

        // Look for standalone .md files for modules
        const standaloneDocs = [
            join(sourceDir, `${moduleName}.md`),
            join(sourceDir, `${moduleName}.ru.md`),
        ]

        for (const standaloneDocPath of standaloneDocs) {
            if (existsSync(standaloneDocPath)) {
                const isRussian = standaloneDocPath.includes('.ru.md')
                const targetFileName = isRussian ? `${moduleName}.ru.md` : `${moduleName}.md`
                const targetPath = join(targetDir, targetFileName)

                let content = readFileSync(standaloneDocPath, 'utf-8')
                content = processMarkdownContent(content, moduleName, slicePath)

                writeFileSync(targetPath, content)

                // Only add to navigation once (prefer English)
                if (!isRussian && !modules.some(m => m.text === moduleName)) {
                    modules.push({
                        text: moduleName,
                        link: `/modules/${slicePath}/${moduleName}`,
                    })
                }

                Console.log(
                    `📄 Copied docs: ${relative(skyPath, standaloneDocPath)} → ${relative(skyPath, targetPath)}`
                )
            }
        }
    }

    return modules
}

/**
 * Process markdown file content
 */
function processMarkdownContent(
    content: string,
    moduleName: string,
    slicePath: string = 'core'
): string {
    // Add title if missing
    if (!content.startsWith('#')) {
        content = `# ${moduleName}\n\n${content}`
    }

    // Add back navigation and gradient description
    const backNavigation = `\n<div style="margin-bottom: 2em;">\n  📚 <a href="../">← Back to All Modules</a>\n</div>\n`

    if (!content.includes('sky-gradient-text')) {
        const lines = content.split('\n')
        const titleIndex = lines.findIndex(line => line.startsWith('#'))

        if (titleIndex !== -1) {
            const gradientDesc = `\n<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">\n  ${moduleName} utility module\n</div>`
            lines.splice(titleIndex + 1, 0, gradientDesc, backNavigation)
            content = lines.join('\n')
        }
    } else {
        // If gradient already exists, add navigation after it
        const lines = content.split('\n')
        const gradientEndIndex = lines.findIndex(line => line.includes('</div>'))

        if (gradientEndIndex !== -1 && !content.includes('Back to All Modules')) {
            lines.splice(gradientEndIndex + 1, 0, '', backNavigation)
            content = lines.join('\n')
        }
    }

    // Add standard installation section if missing
    if (!content.includes('## Installation') && !content.includes('npm install')) {
        // Only add Usage section if it doesn't already exist
        const hasUsageSection = content.includes('## Usage') || content.includes('## Использование')

        const usageSection = hasUsageSection
            ? ''
            : `

## Usage

\`\`\`typescript
import { ${moduleName} } from '@sky-modules/core'
\`\`\``

        const installSection = `\n## Installation

\`\`\`bash
npm install @sky-modules/core
\`\`\`${usageSection}\n`

        // Insert after title and description
        const lines = content.split('\n')
        const insertIndex = lines.findIndex(
            (line, index) => index > 0 && line.startsWith('##') && !line.includes('Installation')
        )

        if (insertIndex !== -1) {
            lines.splice(insertIndex, 0, installSection)
        } else {
            content += installSection
        }

        content = lines.join('\n')
    }

    // Fix GitHub source code links
    content = content.replace(
        /View the \[source code on GitHub\]\(https:\/\/github\.com\/empty-set-games\/sky-modules\/blob\/main\/core\/([^/]+)\/index\.ts\)/g,
        `View the [source code on GitHub](https://github.com/empty-set-dev/sky-modules/tree/main/${slicePath}/$1)`
    )

    return content
}

/**
 * Generate module index page
 */
async function generateModuleIndex(
    slices: Array<{ path: string; config: Sky.Slice }>
): Promise<SidebarGroup[]> {
    const groups: SidebarGroup[] = []

    for (const slice of slices) {
        const items: NavItem[] = []

        for (const moduleName of slice.config.modules || []) {
            items.push({
                text: moduleName,
                link: `/modules/${slice.path}/${moduleName}`,
            })
        }

        if (items.length > 0) {
            groups.push({
                text: `${slice.path} Modules`,
                items,
            })
        }
    }

    return groups
}

/**
 * Update VitePress config with new navigation using JSON.stringify
 */
async function updateVitePressConfig(sidebar: Record<string, SidebarGroup[]>): Promise<void> {
    const configPath = join(skyPath, 'docs', '.vitepress', 'config.ts')

    if (!existsSync(configPath)) {
        Console.warn('⚠️  VitePress config not found, skipping navigation update')
        return
    }

    // Create Russian versions of sidebar entries
    const russianSidebar: Record<string, SidebarGroup[]> = {}

    for (const [path, groups] of Object.entries(sidebar)) {
        const ruPath = path.replace('/modules/', '/ru/modules/')
        russianSidebar[ruPath] = groups.map(group => ({
            text: group.text === 'core Modules' ? 'Модули core' : group.text,
            items: group.items.map(item => ({
                text: item.text,
                link: item.link.replace('/modules/', '/ru/modules/'),
            })),
        }))
    }

    // Create the navigation structure using objects
    const ruThemeConfig = {
        nav: [
            { text: 'Руководство', link: '/ru/guide/getting-started' },
            { text: 'Модули', link: '/ru/modules/' },
            { text: 'Примеры', link: '/ru/examples/' },
            { text: 'Песочница', link: '/ru/playground/' },
            {
                text: 'NPM',
                items: [
                    { text: '__PACKAGE_NAME__', link: '__PACKAGE_LINK__' },
                    { text: 'Все пакеты', link: '/ru/packages/' },
                ],
            },
        ],
        sidebar: russianSidebar,
    }

    const mainThemeConfig = {
        nav: [
            { text: 'Guide', link: '/guide/getting-started' },
            { text: 'Modules', link: '/modules/' },
            { text: 'Examples', link: '/examples/' },
            { text: 'Playground', link: '/playground/' },
            {
                text: 'NPM',
                items: [
                    { text: '__PACKAGE_NAME__', link: '__PACKAGE_LINK__' },
                    { text: 'All packages', link: '/packages/' },
                ],
            },
        ],
        sidebar,
        socialLinks: [
            { icon: 'github', link: '__GITHUB_LINK__' },
            { icon: 'npm', link: '__NPM_LINK__' },
        ],
        footer: {
            message: 'Released under the ISC License.',
            copyright: 'Copyright © 2025 Anya Sky',
        },
        search: {
            provider: 'local',
        },
        editLink: {
            pattern: '__EDIT_PATTERN__',
        },
    }

    // Convert to formatted strings with template literals
    const ruConfigStr = JSON.stringify(ruThemeConfig, null, 16)
        .replace(/"/g, "'")
        .replace(/'__PACKAGE_NAME__'/, '`@${packageInfo.name}-modules/core`')
        .replace(
            /'__PACKAGE_LINK__'/,
            '`https://npmjs.com/package/@${packageInfo.name}-modules/core`'
        )

    const mainConfigStr = JSON.stringify(mainThemeConfig, null, 8)
        .replace(/"/g, "'")
        .replace(
            /'__GITHUB_LINK__'/,
            '`https://github.com/empty-set-dev/${packageInfo.name}-modules`'
        )
        .replace(/'__NPM_LINK__'/, '`https://npmjs.com/~${packageInfo.name}-modules`')
        .replace(
            /'__EDIT_PATTERN__'/,
            '`https://github.com/empty-set-dev/${packageInfo.name}-modules/edit/main/docs/:path`'
        )

    // Read template and replace sections
    const templateConfig = `import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

// Dynamic configuration helpers
function getPackageInfo() {
    const packagePath = join(fileURLToPath(new URL('../../', import.meta.url)), 'package.json')
    if (existsSync(packagePath)) {
        const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
        return {
            name: packageJson.name || 'project',
            description: packageJson.description || 'Project documentation'
        }
    }
    return { name: 'project', description: 'Project documentation' }
}

const packageInfo = getPackageInfo()

export default defineConfig({
    title: \`\${packageInfo.name} Modules\`,
    description: packageInfo.description,
    base: \`/\${packageInfo.name}-modules/\`,

    // Multi-language configuration
    locales: {
        root: {
            label: 'English',
            lang: 'en',
            title: \`\${packageInfo.name} Modules\`,
            description: packageInfo.description
        },
        ru: {
            label: 'Русский',
            lang: 'ru',
            title: \`\${packageInfo.name} Modules\`,
            description: 'Мощные TypeScript утилиты для современной разработки',
            themeConfig: ${ruConfigStr
                .split('\n')
                .map((line, i) => (i === 0 ? line : '            ' + line))
                .join('\n')}
        }
    },

    themeConfig: ${mainConfigStr
        .split('\n')
        .map((line, i) => (i === 0 ? line : '        ' + line))
        .join('\n')},

    vite: {
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('../../', import.meta.url)),
                [packageInfo.name]: fileURLToPath(new URL('../../', import.meta.url))
            }
        }
    },

    markdown: {
        theme: {
            light: 'github-light',
            dark: 'github-dark'
        },
        lineNumbers: true
    }
})`

    writeFileSync(configPath, templateConfig)
    Console.log('📝 Updated VitePress config with auto-generated navigation (English & Russian)')
}

export default generateDocsFromMarkdown
