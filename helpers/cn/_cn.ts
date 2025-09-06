import classNames, { ArgumentArray } from 'classnames'

export type Cx = ((template: TemplateStringsArray, ...args: ArgumentArray) => string) &
    ((...args: ArgumentArray) => string)

export const cx = cn()

export default cn
function cn(template: TemplateStringsArray, ...args: ArgumentArray): string
function cn(styles?: object): Cx
function cn(...args: unknown[]): unknown {
    const styles = args[0] as Record<string, string>

    return (...args: ArgumentArray) => {
        let className = ''

        if (isTemplateStringsArray(args[0])) {
            className = String.raw(
                args[0],
                args.slice(1).map(value => classNames(value))
            )
        } else {
            className = args.join(' ')
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

function getClassName<T extends Record<string, string>>(className: string, styles?: T): string {
    return (styles && styles[className]) ?? className
}
