import '../../configuration/Sky.Slice.global'
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync, rmSync } from 'fs'
import { join, relative } from 'path'
import skyPath from './skyPath'
import findDeployableSlices from './findDeployableSlices'

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
    console.log('📚 Generating VitePress docs from markdown files...')

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

    const sidebar: Record<string, SidebarGroup[]> = {}

    // Process each slice
    for (const slice of slices) {
        const sliceModules = await processSlice(slice.path, slice.config)

        if (sliceModules.length > 0) {
            sidebar[`/modules/${slice.path}/`] = [{
                text: `${slice.path} Modules`,
                items: sliceModules
            }]
        }
    }

    // Generate general module navigation
    const allModules = await generateModuleIndex(slices)
    sidebar['/modules/'] = allModules

    // Update VitePress config
    await updateVitePressConfig(sidebar)

    console.log('✅ VitePress documentation generated successfully!')
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
                join(modulePath, 'index.ru.md')
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

                    // Only add to navigation once (prefer English)
                    if (!isRussian && !modules.some(m => m.text === moduleName)) {
                        modules.push({
                            text: moduleName,
                            link: `/modules/${slicePath}/${moduleName}`
                        })
                    }

                    console.log(`📄 Copied docs: ${relative(skyPath, docPath)} → ${relative(skyPath, targetPath)}`)
                }
            }
        }

        // Look for standalone .md files for modules
        const standaloneDocs = [
            join(sourceDir, `${moduleName}.md`),
            join(sourceDir, `${moduleName}.ru.md`)
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
                        link: `/modules/${slicePath}/${moduleName}`
                    })
                }

                console.log(`📄 Copied docs: ${relative(skyPath, standaloneDocPath)} → ${relative(skyPath, targetPath)}`)
            }
        }
    }

    return modules
}

/**
 * Process markdown file content
 */
function processMarkdownContent(content: string, moduleName: string, slicePath: string = 'core'): string {
    // Get project info from package.json
    const packagePath = join(skyPath, 'package.json')
    const packageJson = existsSync(packagePath) ? JSON.parse(readFileSync(packagePath, 'utf-8')) : {}
    const projectName = packageJson.name || 'project'
    const corePackageName = `@${projectName}-modules/core`
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

        const usageSection = hasUsageSection ? '' : `

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
        const insertIndex = lines.findIndex((line, index) =>
            index > 0 && line.startsWith('##') && !line.includes('Installation')
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
        /View the \[source code on GitHub\]\(https:\/\/github\.com\/empty-set-games\/sky-modules\/blob\/main\/core\/([^\/]+)\/index\.ts\)/g,
        `View the [source code on GitHub](https://github.com/empty-set-dev/sky-modules/tree/main/${slicePath}/$1)`
    )

    return content
}

/**
 * Generate module index page
 */
async function generateModuleIndex(slices: Array<{ path: string, config: Sky.Slice }>): Promise<SidebarGroup[]> {
    const groups: SidebarGroup[] = []

    for (const slice of slices) {
        const items: NavItem[] = []

        for (const moduleName of slice.config.modules || []) {
            items.push({
                text: moduleName,
                link: `/modules/${slice.path}/${moduleName}`
            })
        }

        if (items.length > 0) {
            groups.push({
                text: `${slice.path} Modules`,
                items
            })
        }
    }

    return groups
}

/**
 * Update VitePress config with new navigation
 */
async function updateVitePressConfig(sidebar: Record<string, SidebarGroup[]>): Promise<void> {
    const configPath = join(skyPath, 'docs', '.vitepress', 'config.ts')

    if (!existsSync(configPath)) {
        console.warn('⚠️  VitePress config not found, skipping navigation update')
        return
    }

    let configContent = readFileSync(configPath, 'utf-8')

    // More reliable sidebar replacement with proper formatting
    const sidebarJson = JSON.stringify(sidebar, null, 4).replace(/"/g, "'")

    // Find start and end of sidebar section
    const sidebarStart = configContent.indexOf('sidebar:')
    const afterSidebar = configContent.indexOf('socialLinks:', sidebarStart)

    if (sidebarStart !== -1 && afterSidebar !== -1) {
        const before = configContent.substring(0, sidebarStart)
        const after = configContent.substring(afterSidebar)

        // Properly indent the sidebar JSON to match existing code style
        const indentedSidebar = sidebarJson
            .split('\n')
            .map((line, index) => {
                if (index === 0) return line // First line already has 'sidebar: '
                return '        ' + line // 8 spaces for proper indentation
            })
            .join('\n')

        configContent = before + `sidebar: ${indentedSidebar},\n\n        ` + after
    }

    writeFileSync(configPath, configContent)
    console.log('📝 Updated VitePress config with auto-generated navigation')
}

export default generateDocsFromMarkdown