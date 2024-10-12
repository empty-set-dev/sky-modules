import { FC, PropsWithChildren, ReactNode } from 'react'

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
