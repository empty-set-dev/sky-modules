import classNames, { Argument, ArgumentArray } from 'classnames'

export type Cx = ((template: TemplateStringsArray, ...args: ArgumentArray) => string) &
    ((arg: Argument, ...args: ArgumentArray) => string)

export const cx = cn()

export default function cn(styles?: Record<string, string>): Cx {
    return (...args: ArgumentArray) => {
        let className = ''

        if (isTemplateStringsArray(args[0])) {
            className = String.raw(
                args[0],
                args.slice(1).map(value => classNames(value))
            )
        } else {
            className = args.map(value => classNames(value)).join(' ')
        }

        className = className
            .replaceAll(/[ \t\n\r]+/g, ' ')
            .trim()
            .split(' ')
            .map(className => getClassName(className, styles))
            .join(' ')

        return className
    }
}

function getClassName(className: string, styles?: Record<string, string>): string {
    if (className.startsWith('@')) {
        className = className.slice(1)

        if (styles == null || styles[className] == null) {
            throw new Error(`missing style for .${className}`)
        }

        return styles[className]
    }
    return className
}
