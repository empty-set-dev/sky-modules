import { ArgumentArray } from 'classnames'
import classNames from 'classnames/bind'

export default function classnames(
    styles: Record<string, string>
): (template: TemplateStringsArray, ...args: ArgumentArray) => string {
    let className = ''

    return (template: TemplateStringsArray, ...args: ArgumentArray) => {
        function getClassName(str: string): string {
            if (str.indexOf('::') !== -1) {
                className = str.split('::').join(':')
                return className
            } else if (str.indexOf(':') !== -1) {
                className = str.split(':')[1]
                return styles[className]
            } else {
                return str
            }
        }

        if (!template.raw) {
            return classNames
                .call(undefined, template as unknown as string, ...(args as string[]))
                .split(' ')
                .map(classname => getClassName(classname))
                .join(' ')
        }

        const params = []

        for (let i = 0; i < args.length; ++i) {
            if (template[i].endsWith(' ')) {
                params.push(template[i])
                params.push(args[i])
            } else {
                params.push(template[i] + args[i])
            }
        }

        params.push(template[template.length - 1])

        return classNames
            .call(undefined, params)
            .split(/[ \n]/g)
            .map(classname => getClassName(classname.trim()))
            .join(' ')
    }
}
