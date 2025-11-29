/**
 * Text wrapping utility for canvas rendering
 * Breaks text into lines that fit within maxWidth
 */

export interface WrapTextOptions {
    /**
     * Text to wrap
     */
    text: string

    /**
     * Maximum width for each line in pixels
     */
    maxWidth: number

    /**
     * Canvas context for measuring text
     */
    ctx: CanvasRenderingContext2D

    /**
     * Word wrap mode
     * - 'normal': Break on word boundaries (default)
     * - 'break-word': Break words if needed
     * - 'pre-wrap': Preserve line breaks and wrap words
     */
    wordWrap?: 'normal' | 'break-word' | 'pre-wrap'
}

/**
 * Wraps text to fit within maxWidth
 * Returns array of lines
 */
export function wrapText(options: WrapTextOptions): string[] {
    const { text, maxWidth, ctx, wordWrap = 'normal' } = options

    // If no maxWidth, return original text as single line
    if (!maxWidth || maxWidth <= 0) {
        return [text]
    }

    const lines: string[] = []

    // Handle pre-wrap mode (preserve existing line breaks)
    const paragraphs = wordWrap === 'pre-wrap' ? text.split('\n') : [text]

    for (const paragraph of paragraphs) {
        // Split into words
        const words = paragraph.split(' ')
        let currentLine = ''

        for (let i = 0; i < words.length; i++) {
            const word = words[i]
            const testLine = currentLine ? `${currentLine} ${word}` : word
            const metrics = ctx.measureText(testLine)
            const testWidth = metrics.width

            if (testWidth > maxWidth && currentLine) {
                // Current line is full, push it and start new line
                lines.push(currentLine)

                // Check if single word exceeds maxWidth
                const wordWidth = ctx.measureText(word).width

                if (wordWidth > maxWidth && wordWrap === 'break-word') {
                    // Break word into characters
                    let charLine = ''

                    for (const char of word) {
                        const testCharLine = charLine + char
                        const charWidth = ctx.measureText(testCharLine).width

                        if (charWidth > maxWidth && charLine) {
                            lines.push(charLine)
                            charLine = char
                        } else {
                            charLine = testCharLine
                        }
                    }

                    currentLine = charLine
                } else {
                    currentLine = word
                }
            } else {
                currentLine = testLine
            }
        }

        // Push remaining line
        if (currentLine) {
            lines.push(currentLine)
        }

        // Add empty line for pre-wrap mode if there are more paragraphs
        if (wordWrap === 'pre-wrap' && paragraphs.indexOf(paragraph) < paragraphs.length - 1) {
            lines.push('')
        }
    }

    return lines.length > 0 ? lines : [text]
}
