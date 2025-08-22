import classNames, { ArgumentArray } from 'classnames'

export type Cx = (template: TemplateStringsArray, ...args: ArgumentArray) => string

const cx = classnames()

export default cx

export function classnames<T extends Record<string, string>>(styles?: T): Cx {
    return (template: TemplateStringsArray, ...args: ArgumentArray) => {
        if (!template.raw) {
            return classNames(template, ...args)
                .replaceAll(/[ \n\r]+/g, ' ')
                .trim()
                .split(' ')
                .map(className => getClassName(className, styles))
                .join(' ')
        }

        let names = ''

        for (let i = 0; i < args.length; ++i) {
            names += template[i]
            names += classNames(args[i])
        }

        names += template[template.length - 1]

        return names
            .replaceAll(/[ \t\n\r]+/g, ' ')
            .trim()
            .split(' ')
            .map(className => getClassName(className, styles))
            .join(' ')
    }
}

function getClassName<T extends Record<string, string>>(str: string, styles?: T): string {
    if (str.indexOf('[') !== -1) {
        const className = `${str.slice(1, -1)}`
        return (styles && styles[className]) ?? className
    } else {
        return (styles && styles[str]) ?? str
    }
}
