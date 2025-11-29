/**
 * Code formatting utilities
 */

/**
 * Fix indentation to match target tab width
 */
export function fixIndentation(code: string, tabWidth: number = 2): string {
    if (tabWidth === 2) return code // Already correct

    const lines = code.split('\n')
    const fixedLines = lines.map(line => {
        // Count leading spaces
        const leadingSpaces = line.match(/^( *)/)?.[1]?.length || 0

        // Skip lines that don't have leading spaces
        if (leadingSpaces === 0) return line

        // Convert 2-space indents to tabWidth-space indents
        const indentLevel = Math.floor(leadingSpaces / 2)
        const newIndent = ' '.repeat(indentLevel * tabWidth)
        const restOfLine = line.substring(leadingSpaces)

        return newIndent + restOfLine
    })

    return fixedLines.join('\n')
}
