import { FC, PropsWithChildren, ReactNode } from 'react'

/**
 * Renders an internationalized template string with React component interpolation.
 *
 * This function parses a template string containing component placeholders in the format
 * `<[key]>content</>` and renders them as React components. It's similar to react-i18next's
 * Trans component but uses a custom template syntax.
 *
 * @param string Template string with component placeholders
 * @param args Record mapping placeholder keys to React component constructors
 * @returns Array of React nodes representing the rendered template
 *
 * @example Basic usage
 * ```typescript
 * import renderLocaleTemplateString from '@sky-modules/helpers/renderLocaleTemplateString'
 *
 * const Bold: FC<PropsWithChildren> = ({ children }) => <strong>{children}</strong>
 * const Link: FC<PropsWithChildren> = ({ children }) => <a href="#">{children}</a>
 *
 * const template = "Click <[link]>here</> to learn <[bold]>more</>"
 *
 * const result = renderLocaleTemplateString(template, {
 *   link: Link,
 *   bold: Bold
 * })
 * // Renders: Click <a href="#">here</a> to learn <strong>more</strong>
 * ```
 *
 * @example i18n with styled components
 * ```typescript
 * const Highlight: FC<PropsWithChildren> = ({ children }) => (
 *   <span className="highlight">{children}</span>
 * )
 *
 * const translatedText = t('welcome.message')
 * // translatedText = "Welcome <[highlight]>back</>, user!"
 *
 * const rendered = renderLocaleTemplateString(translatedText, {
 *   highlight: Highlight
 * })
 * ```
 */
export default function renderLocaleTemplateString(
    string: string,
    args: Record<string, FC<PropsWithChildren>>
): ReactNode {
    const result: ReactNode[] = []

    Object.keys(args)
        .sort((a, b) => {
            const regexA = `<[${a}]>`
            const regexB = `<[${b}]>`
            return string.indexOf(regexA) - string.indexOf(regexB)
        })
        .forEach(k => {
            const regex = new RegExp(`<\\[${k}]\\>(.*)</>`, 'g')
            const Component = args[k]
            const parts = string.split(regex)

            if (parts.length === 1) {
                return
            }

            result.push(
                <span key={result.length} dangerouslySetInnerHTML={{ __html: parts[0] }} />,
                <Component key={k}>
                    <span dangerouslySetInnerHTML={{ __html: parts[1] }} />
                </Component>
            )
            string = parts[2]
        })

    result.push(<span key={result.length} dangerouslySetInnerHTML={{ __html: string }} />)

    return result
}
