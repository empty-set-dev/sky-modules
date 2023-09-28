import cn from 'classnames'

export default function classnames(
    styles: Record<string, string>
): (template: TemplateStringsArray, ...args: cn.ArgumentArray) => string {
    let className = ''

    return (template: TemplateStringsArray, ...args: cn.ArgumentArray): string => {
        function getClassName(str: string): string {
            if (str[1] === ':') {
                className = str.slice(2)
                return styles[className as keyof typeof styles]
            } else {
                return str
            }
        }

        if (!template.raw) {
            return cn(...template)
                .split(' ')
                .map(classname => getClassName(classname))
                .join(' ')
        }

        const params = [] as cn.ArgumentArray

        for (let i = 0; i < args.length; ++i) {
            if (template[i].endsWith(' ')) {
                params.push(template[i])
                params.push(args[i])
            } else {
                params.push(template[i] + args[i])
            }
        }

        params.push(template[template.length - 1])

        return cn(...params)
            .split(' ')
            .map(classname => getClassName(classname))
            .join(' ')
    }
}
