import { ArgumentArray } from 'classnames'
import classNames from 'classnames/bind'

export default function classnames<T>(
    block: string,
    styles: T = {} as T
): (template: TemplateStringsArray, ...args: ArgumentArray) => string {
    if (styles instanceof Promise) {
        return (styles as never as Promise<{ default: Awaited<T> }>).then(style =>
            classnames(block, style.default)
        ) as never
    }

    return (template: TemplateStringsArray, ...args: ArgumentArray) => {
        function getClassName(str: string): string {
            if (str.indexOf('e:') !== -1) {
                const className = `${block}-${str.slice(2)}`
                return styles[className] ?? className
            } else {
                return styles[str] ?? str
            }
        }

        if (!template.raw) {
            return classNames
                .call(undefined, template as unknown as string, ...args)
                .replaceAll(/[ \n\r]+/g, ' ')
                .trim()
                .split(' ')
                .map(className => getClassName(className))
                .join(' ')
        }

        const params: unknown[] = []

        for (let i = 0; i < args.length; ++i) {
            if (
                template[i] === '' ||
                template[i][template[i].length - 1] === ' ' ||
                template[i][template[i].length - 1] === '    ' ||
                template[i][template[i].length - 1] === '\n' ||
                template[i][template[i].length - 1] === '\r'
            ) {
                params.push(template[i])
                params.push(args[i])
            } else {
                params.push(template[i] + args[i])
            }
        }

        params.push(template[template.length - 1])

        return classNames
            .call(undefined, ...params)
            .replaceAll(/[ \n\r]+/g, ' ')
            .trim()
            .split(' ')
            .map(className => getClassName(className))
            .join(' ')
    }
}
