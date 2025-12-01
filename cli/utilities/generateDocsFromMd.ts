import '@sky-modules/cli/configuration/Sky.Slice.namespace'
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, rmSync } from 'fs'
import { join, relative } from 'path'

import Console from './Console'
import findDeployableSlices from './findDeployableSlices'
import workspaceRoot from './workspaceRoot'

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
    if (workspaceRoot == null) {
        throw new Error('Sky workspace not found')
    }

    Console.log('📚 Generating VitePress docs from markdown files...')

    const slices = findDeployableSlices()
    const docsDir = join(workspaceRoot, 'docs')
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
    const mainReadmeRu = join(workspaceRoot, 'README.ru.md')

    if (existsSync(mainReadmeRu)) {
        const ruIndexPath = join(ruDir, 'index.md')
        let ruContent = readFileSync(mainReadmeRu, 'utf-8')
        // Process content for VitePress
        ruContent = ruContent.replace(/\[([^\]]+)\]\(#([^)]+)\)/g, '[$1](#$2)')
        ruContent = ruContent.replace(
            /\[LICENSE\]\(LICENSE\)/g,
            '[LICENSE](https://github.com/empty-set-games/sky-modules/blob/main/LICENSE)'
        )
        // Fix playground links - convert relative paths to VitePress paths
        ruContent = ruContent.replace(/\]\(\.\.\/\.\.\/playground\/?\)/g, '](/playground/)')
        writeFileSync(ruIndexPath, ruContent)
        Console.log(`📄 Created Russian index: ${relative(workspaceRoot, ruIndexPath)}`)
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
    Console.log(`📄 Created Russian modules index: ${relative(workspaceRoot, ruModulesIndex)}`)

    const sidebar: Record<string, SidebarGroup[]> = {}

    // Process each slice
    for (const slice of slices) {
        const sliceModules = await processSlice(slice.path, slice.config)

        // Only add to sidebar if there are modules with documentation
        if (sliceModules.length > 0) {
            const capitalizedPath = slice.path.charAt(0).toUpperCase() + slice.path.slice(1)
            sidebar[`/modules/${slice.path}/`] = [
                {
                    text: `${capitalizedPath} Modules`,
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
    if (workspaceRoot == null) {
        throw new Error('Sky workspace not found')
    }

    const sourceDir = join(workspaceRoot, slicePath)
    const targetDir = join(workspaceRoot, 'docs', 'modules', slicePath)

    mkdirSync(targetDir, { recursive: true })

    const modules: NavItem[] = []

    // Look for .md files in module folders
    for (const moduleName of slice.modules || []) {
        // Handle "." as the slice itself
        if (moduleName === '.') {
            // Look for slice-level documentation files
            const sliceName = slicePath.charAt(0).toUpperCase() + slicePath.slice(1)
            const sliceDocs = [
                join(sourceDir, `${slicePath}.md`),
                join(sourceDir, `${slicePath}.ru.md`),
                join(sourceDir, `${sliceName}.md`),
                join(sourceDir, `${sliceName}.ru.md`),
                join(sourceDir, 'README.md'),
                join(sourceDir, 'README.ru.md'),
            ]

            const processedDocs = new Set<string>()

            for (const docPath of sliceDocs) {
                if (existsSync(docPath)) {
                    const isRussian = docPath.includes('.ru.md')
                    const targetFileName = isRussian ? `${slicePath}.ru.md` : `${slicePath}.md`
                    const targetPath = join(targetDir, targetFileName)

                    const langKey = `${slicePath}-${isRussian ? 'ru' : 'en'}`
                    if (processedDocs.has(langKey)) continue

                    let content = readFileSync(docPath, 'utf-8')
                    content = processMarkdownContent(content, sliceName, slicePath)

                    writeFileSync(targetPath, content)
                    processedDocs.add(langKey)

                    if (isRussian) {
                        const ruDir = join(workspaceRoot, 'docs', 'ru', 'modules', slicePath)
                        mkdirSync(ruDir, { recursive: true })
                        const ruTargetPath = join(ruDir, `${slicePath}.md`)
                        writeFileSync(ruTargetPath, content)
                        Console.log(
                            `📄 Created Russian locale: ${relative(workspaceRoot, ruTargetPath)}`
                        )
                    }

                    if (!isRussian && !modules.some(m => m.text === sliceName)) {
                        modules.push({
                            text: sliceName,
                            link: `/modules/${slicePath}/${slicePath}`,
                        })
                    }

                    Console.log(
                        `📄 Copied docs: ${relative(workspaceRoot, docPath)} → ${relative(workspaceRoot, targetPath)}`
                    )
                }
            }

            // Also scan subdirectories for sub-modules when "." is specified
            const { readdirSync } = await import('fs')
            const entries = readdirSync(sourceDir, { withFileTypes: true })

            for (const entry of entries) {
                if (!entry.isDirectory()) continue

                // Skip common non-module directories
                if (entry.name.startsWith('.') ||
                    entry.name.startsWith('_') ||
                    entry.name === 'node_modules' ||
                    entry.name === 'global') {
                    continue
                }

                const subModulePath = join(sourceDir, entry.name)
                const possibleDocs = [
                    join(subModulePath, 'README.md'),
                    join(subModulePath, 'README.ru.md'),
                    join(subModulePath, `${entry.name}.md`),
                    join(subModulePath, `${entry.name}.ru.md`),
                ]

                const processedSubDocs = new Set<string>()

                for (const docPath of possibleDocs) {
                    if (existsSync(docPath)) {
                        const isRussian = docPath.includes('.ru.md')
                        const targetFileName = isRussian ? `${entry.name}.ru.md` : `${entry.name}.md`
                        const targetPath = join(targetDir, targetFileName)

                        const langKey = `${entry.name}-${isRussian ? 'ru' : 'en'}`
                        if (processedSubDocs.has(langKey)) continue

                        let content = readFileSync(docPath, 'utf-8')
                        content = processMarkdownContent(content, entry.name, slicePath)

                        writeFileSync(targetPath, content)
                        processedSubDocs.add(langKey)

                        if (isRussian) {
                            const ruDir = join(workspaceRoot, 'docs', 'ru', 'modules', slicePath)
                            mkdirSync(ruDir, { recursive: true })
                            const ruTargetPath = join(ruDir, `${entry.name}.md`)
                            writeFileSync(ruTargetPath, content)
                            Console.log(
                                `📄 Created Russian locale: ${relative(workspaceRoot, ruTargetPath)}`
                            )
                        }

                        if (!isRussian && !modules.some(m => m.text === entry.name)) {
                            modules.push({
                                text: entry.name,
                                link: `/modules/${slicePath}/${entry.name}`,
                            })
                        }

                        Console.log(
                            `📄 Copied docs: ${relative(workspaceRoot, docPath)} → ${relative(workspaceRoot, targetPath)}`
                        )
                    }
                }

                // Scan sub-directories within this sub-module (e.g., canvas/core/renderers)
                const subEntries = readdirSync(subModulePath, { withFileTypes: true })

                for (const subEntry of subEntries) {
                    if (!subEntry.isDirectory()) continue

                    // Skip common non-module directories
                    if (subEntry.name.startsWith('.') ||
                        subEntry.name.startsWith('_') ||
                        subEntry.name === 'node_modules' ||
                        subEntry.name === 'global') {
                        continue
                    }

                    const nestedPath = join(subModulePath, subEntry.name)
                    const nestedDocs = [
                        join(nestedPath, 'README.md'),
                        join(nestedPath, 'README.ru.md'),
                        join(nestedPath, `${subEntry.name}.md`),
                        join(nestedPath, `${subEntry.name}.ru.md`),
                    ]

                    const processedNestedDocs = new Set<string>()

                    for (const nestedDocPath of nestedDocs) {
                        if (existsSync(nestedDocPath)) {
                            const isRussian = nestedDocPath.includes('.ru.md')
                            // Use parent-child naming: e.g., "core-renderers.md"
                            const combinedName = `${entry.name}-${subEntry.name}`
                            const targetFileName = isRussian ? `${combinedName}.ru.md` : `${combinedName}.md`
                            const targetPath = join(targetDir, targetFileName)

                            const langKey = `${combinedName}-${isRussian ? 'ru' : 'en'}`
                            if (processedNestedDocs.has(langKey)) continue

                            let content = readFileSync(nestedDocPath, 'utf-8')
                            content = processMarkdownContent(content, subEntry.name, slicePath)

                            writeFileSync(targetPath, content)
                            processedNestedDocs.add(langKey)

                            if (isRussian) {
                                const ruDir = join(workspaceRoot, 'docs', 'ru', 'modules', slicePath)
                                mkdirSync(ruDir, { recursive: true })
                                const ruTargetPath = join(ruDir, `${combinedName}.md`)
                                writeFileSync(ruTargetPath, content)
                                Console.log(
                                    `📄 Created Russian locale: ${relative(workspaceRoot, ruTargetPath)}`
                                )
                            }

                            if (!isRussian && !modules.some(m => m.link === `/modules/${slicePath}/${combinedName}`)) {
                                modules.push({
                                    text: `${entry.name} / ${subEntry.name}`,
                                    link: `/modules/${slicePath}/${combinedName}`,
                                })
                            }

                            Console.log(
                                `📄 Copied docs: ${relative(workspaceRoot, nestedDocPath)} → ${relative(workspaceRoot, targetPath)}`
                            )
                        }
                    }
                }
            }

            continue
        }

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
                        const ruDir = join(workspaceRoot, 'docs', 'ru', 'modules', slicePath)
                        mkdirSync(ruDir, { recursive: true })
                        const ruTargetPath = join(ruDir, `${moduleName}.md`)
                        writeFileSync(ruTargetPath, content)
                        Console.log(
                            `📄 Created Russian locale: ${relative(workspaceRoot, ruTargetPath)}`
                        )
                    }

                    // Only add to navigation once (prefer English)
                    if (!isRussian && !modules.some(m => m.text === moduleName)) {
                        modules.push({
                            text: moduleName,
                            link: `/modules/${slicePath}/${moduleName}`,
                        })
                    }

                    Console.log(
                        `📄 Copied docs: ${relative(workspaceRoot, docPath)} → ${relative(workspaceRoot, targetPath)}`
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
                    `📄 Copied docs: ${relative(workspaceRoot, standaloneDocPath)} → ${relative(workspaceRoot, targetPath)}`
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

    // Add gradient description (without back navigation for npm packages)
    if (!content.includes('sky-gradient-text')) {
        const lines = content.split('\n')
        const titleIndex = lines.findIndex(line => line.startsWith('#'))

        if (titleIndex !== -1) {
            const gradientDesc = `\n<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">\n  ${moduleName} utility module\n</div>`
            lines.splice(titleIndex + 1, 0, gradientDesc)
            content = lines.join('\n')
        }
    }

    // Add playground link if available (check if playground exists for this slice)
    if (workspaceRoot && !content.includes('<PlaygroundLink')) {
        const playgroundPath = join(workspaceRoot, 'playground', slicePath, 'package.json')
        if (existsSync(playgroundPath)) {
            const lines = content.split('\n')
            const titleIndex = lines.findIndex(line => line.startsWith('#'))

            if (titleIndex !== -1) {
                const isRussian = content.includes('Установка') || content.includes('Использование')
                const playgroundLabel = isRussian
                    ? `Открыть ${slicePath.charAt(0).toUpperCase() + slicePath.slice(1)} Playground`
                    : `Open ${slicePath.charAt(0).toUpperCase() + slicePath.slice(1)} Playground`

                const playgroundLink = `\n<PlaygroundLink id="${slicePath}" label="${playgroundLabel}" />\n`

                // Insert after gradient description
                const gradientIndex = lines.findIndex(line => line.includes('sky-gradient-text'))
                if (gradientIndex !== -1) {
                    // Find the closing </div> tag
                    const closingDivIndex = lines.findIndex((line, idx) => idx > gradientIndex && line.includes('</div>'))
                    if (closingDivIndex !== -1) {
                        lines.splice(closingDivIndex + 1, 0, playgroundLink)
                        content = lines.join('\n')
                    }
                }
            }
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

    // Fix playground links - convert relative paths to VitePress paths
    content = content.replace(/\]\(\.\.\/\.\.\/playground\/?\)/g, '](/playground/)')

    return content
}

/**
 * Generate module index page
 */
async function generateModuleIndex(
    slices: Array<{ path: string; config: Sky.Slice }>
): Promise<SidebarGroup[]> {
    if (workspaceRoot == null) {
        throw new Error('Sky workspace not found')
    }

    const groups: SidebarGroup[] = []

    for (const slice of slices) {
        const items: NavItem[] = []

        for (const moduleName of slice.config.modules || []) {
            // Handle "." as the slice itself
            if (moduleName === '.') {
                const sliceName = slice.path.charAt(0).toUpperCase() + slice.path.slice(1)
                const sourceDir = join(workspaceRoot, slice.path)

                // Check if documentation exists
                const hasDoc =
                    existsSync(join(sourceDir, `${slice.path}.md`)) ||
                    existsSync(join(sourceDir, `${sliceName}.md`)) ||
                    existsSync(join(sourceDir, 'README.md'))

                if (hasDoc) {
                    items.push({
                        text: sliceName,
                        link: `/modules/${slice.path}/${slice.path}`,
                    })
                }

                // Also scan subdirectories for sub-modules
                const { readdirSync } = await import('fs')
                const entries = readdirSync(sourceDir, { withFileTypes: true })

                for (const entry of entries) {
                    if (!entry.isDirectory()) continue

                    // Skip common non-module directories
                    if (entry.name.startsWith('.') ||
                        entry.name.startsWith('_') ||
                        entry.name === 'node_modules' ||
                        entry.name === 'global') {
                        continue
                    }

                    const subModulePath = join(sourceDir, entry.name)
                    const hasSubDoc =
                        existsSync(join(subModulePath, 'README.md')) ||
                        existsSync(join(subModulePath, `${entry.name}.md`))

                    if (hasSubDoc) {
                        items.push({
                            text: entry.name,
                            link: `/modules/${slice.path}/${entry.name}`,
                        })
                    }
                }
            } else {
                const sourceDir = join(workspaceRoot, slice.path)
                const modulePath = join(sourceDir, moduleName)

                // Check if documentation exists
                const hasDoc =
                    existsSync(join(modulePath, 'README.md')) ||
                    existsSync(join(modulePath, `${moduleName}.md`)) ||
                    existsSync(join(sourceDir, `${moduleName}.md`))

                if (hasDoc) {
                    items.push({
                        text: moduleName,
                        link: `/modules/${slice.path}/${moduleName}`,
                    })
                }
            }
        }

        if (items.length > 0) {
            const capitalizedPath = slice.path.charAt(0).toUpperCase() + slice.path.slice(1)
            groups.push({
                text: `${capitalizedPath} Modules`,
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
    if (workspaceRoot == null) {
        throw new Error('Sky workspace not found')
    }

    const configPath = join(workspaceRoot, 'docs', '.vitepress', 'config.ts')

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
            { text: 'Примеры', link: '/ru/playground/' },
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
            { text: 'Examples', link: '/playground/' },
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
        const name = packageJson.name || 'project'
        // Capitalize first letter for display (e.g., "sky" -> "Sky")
        const displayName = name.charAt(0).toUpperCase() + name.slice(1)
        return {
            name: name,                    // Original for URLs and paths
            displayName: displayName,      // Capitalized for display
            description: packageJson.description || 'Project documentation'
        }
    }
    return { name: 'project', displayName: 'Project', description: 'Project documentation' }
}

const packageInfo = getPackageInfo()

export default defineConfig({
    title: \`\${packageInfo.displayName} Modules\`,
    description: packageInfo.description,
    // Read base path from environment or use default
    base: process.env.VITEPRESS_BASE || \`/\${packageInfo.name}-modules/\`,
    // Ignore dead links completely for documentation generation
    ignoreDeadLinks: true,

    // Multi-language configuration
    locales: {
        root: {
            label: 'English',
            lang: 'en',
            title: \`\${packageInfo.displayName} Modules\`,
            description: packageInfo.description
        },
        ru: {
            label: 'Русский',
            lang: 'ru',
            title: \`\${packageInfo.displayName} Modules\`,
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
    }
})`

    writeFileSync(configPath, templateConfig)
    Console.log('📝 Updated VitePress config with auto-generated navigation (English & Russian)')
}

export default generateDocsFromMarkdown
