import { Argument } from 'classnames'
import { JSX } from 'react'
import globalify from 'sky/standard/globalify'

declare global {
    function sxWith(cx: Cx): ReturnType<typeof lib.sxWith>
}

namespace lib {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
    export function sxWith(cx: Cx) {
        function commonSx(
            tag: keyof JSX.IntrinsicElements,
            sx: string | TemplateStringsArray,
            ...args: Argument[]
        ): (props: BoxProps) => ReactNode {
            sx = cx(sx, ...args)
            return function Styled(props: BoxProps): ReactNode {
                const finalSX = props.sx ? `${sx} ${props.sx}` : sx
                return <Box as={tag} {...props} sx={finalSX} />
            }
        }

        function createSxAs(
            tag: keyof JSX.IntrinsicElements
        ): (
            sx: string | TemplateStringsArray,
            ...args: Argument[]
        ) => (props: BoxProps) => ReactNode {
            return function sxAs(
                sx: string | TemplateStringsArray,
                ...args: Argument[]
            ): (props: BoxProps) => ReactNode {
                return commonSx(tag, sx, ...args)
            }
        }

        function sx(
            sx: string | TemplateStringsArray,
            ...args: Argument[]
        ): (props: BoxProps) => ReactNode {
            return commonSx('div', sx, ...args)
        }

        // FIXME optimize
        sx.header = createSxAs('header')
        sx.footer = createSxAs('footer')
        sx.div = createSxAs('div')
        sx.section = createSxAs('section')
        sx.span = createSxAs('span')
        sx.a = createSxAs('a')
        sx.input = createSxAs('input')
        sx.form = createSxAs('form')
        sx.textarea = createSxAs('textarea')
        sx.label = createSxAs('label')
        sx.p = createSxAs('p')
        sx.b = createSxAs('b')
        sx.i = createSxAs('i')

        return sx
    }
}

globalify(lib)
