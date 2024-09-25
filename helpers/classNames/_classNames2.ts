import cn, { ArgumentArray } from 'classnames'

export type Cx = (template: TemplateStringsArray, ...args: ArgumentArray) => string

export default function classNames<T extends typeof import('*.scss').default>(
    block?: string,
    styles?: T
): Cx {
    if (block && block.indexOf('[') !== -1) {
        block = block.slice(1, -1)
    }

    return (template: TemplateStringsArray, ...args: ArgumentArray) => {
        function getClassName(str: string): string {
            if (str.indexOf('[') !== -1) {
                const className = `${str.slice(1, -1)}`
                return (styles && styles[className]) ?? className
            } else if (str.indexOf('e:') !== -1) {
                const className = `${block}-${str.slice(2)}`
                return (styles && styles[className]) ?? className
            } else {
                return (styles && styles[str]) ?? str
            }
        }

        if (!template.raw) {
            return cn(template, ...args)
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
                template[i][template[i].length - 1] === '\t' ||
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

        return cn(params)
            .replaceAll(/[ \n\r]+/g, ' ')
            .trim()
            .split(' ')
            .map(className => getClassName(className))
            .join(' ')
    }
}
