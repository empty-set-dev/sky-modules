import path from 'path'

import type { Plugin, AtRule } from 'postcss'

interface ResolveAliasesOptions {
    aliases: Record<string, string>
    baseDir: string
}

/**
 * PostCSS plugin to resolve custom path aliases in @import and @reference directives
 * before they are processed by Tailwind CSS
 */
export default function postcssResolveAliases(options: ResolveAliasesOptions): Plugin {
    const { aliases, baseDir } = options

    return {
        postcssPlugin: 'postcss-resolve-aliases',
        Once(root, { result }) {
            const from = result.opts.from || ''
            const fromDir = path.dirname(from)

            root.walkAtRules((atRule: AtRule) => {
                // Handle @import and @reference directives
                if (atRule.name === 'import' || atRule.name === 'reference') {
                    const params = atRule.params.trim()

                    // Extract the path from quotes (handles both single and double quotes)
                    const match = params.match(/^['"]([^'"]+)['"]/)
                    if (!match) return

                    const originalPath = match[1]
                    let resolvedPath = originalPath

                    // Check if path starts with any of our aliases
                    for (const [alias, replacement] of Object.entries(aliases)) {
                        if (originalPath.startsWith(alias + '/')) {
                            // Replace alias with its target path
                            const relativePath = originalPath.slice(alias.length + 1)
                            const absolutePath = path.resolve(replacement, relativePath)

                            // Convert to relative path from current file
                            resolvedPath = path.relative(fromDir, absolutePath)

                            // Ensure forward slashes and add ./ prefix if needed
                            resolvedPath = resolvedPath.replace(/\\/g, '/')

                            if (!resolvedPath.startsWith('.')) {
                                resolvedPath = './' + resolvedPath
                            }

                            break
                        }
                    }

                    // Also handle paths relative to baseDir (like 'x/...')
                    if (!resolvedPath.startsWith('.') && !resolvedPath.startsWith('/')) {
                        const absolutePath = path.resolve(baseDir, resolvedPath)

                        if (absolutePath !== resolvedPath) {
                            resolvedPath = path.relative(fromDir, absolutePath)
                            resolvedPath = resolvedPath.replace(/\\/g, '/')

                            if (!resolvedPath.startsWith('.')) {
                                resolvedPath = './' + resolvedPath
                            }
                        }
                    }

                    // Update the params if path was changed
                    if (resolvedPath !== originalPath) {
                        // Preserve the quote style and any additional parameters
                        const quote = params[0]
                        const restParams = params.slice(match[0].length)
                        atRule.params = `${quote}${resolvedPath}${quote}${restParams}`
                    }
                }
            })
        },
    }
}

postcssResolveAliases.postcss = true
