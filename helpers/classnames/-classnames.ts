import { ArgumentArray } from 'classnames'
import classNames from 'classnames/bind'

export default classnames as classnames
interface classnames {
    (styles: Promise<{ default: Record<string, string> }>): Promise<
        (template: TemplateStringsArray, ...args: ArgumentArray) => string
    >
    (styles: Record<string, string>): (
        template: TemplateStringsArray,
        ...args: ArgumentArray
    ) => string
}
function classnames(
    styles: Record<string, string>
): (template: TemplateStringsArray, ...args: ArgumentArray) => string {
    if (styles instanceof Promise) {
        return styles.then(styles => classnames(styles.default)) as never
    }

    let className = ''

    return (template: TemplateStringsArray, ...args: ArgumentArray) => {
        function getClassName(str: string): string {
            if (str.indexOf('::') !== -1) {
                className = str.split('::').join(':')
                return className
            } else if (str.indexOf(':') !== -1) {
                {
                    const _ = str.split(':')
                    className = _[_.length - 1]
                }
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
