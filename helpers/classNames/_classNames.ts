import classNames, { ArgumentArray } from 'classnames'

export type Cx = (template: TemplateStringsArray, ...args: ArgumentArray) => string

export const cx = cn()

export default cn
function cn(template: TemplateStringsArray, ...args: ArgumentArray): string
function cn(styles?: object): Cx
function cn(...args: unknown[]): unknown {
    if (typeof args[0] === 'string') {
        const template = args[0] as string & TemplateStringsArray
        const args_ = args.slice(1)
        return cx(template, args_)
    }

    const styles = args[0] as Record<string, string>

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
