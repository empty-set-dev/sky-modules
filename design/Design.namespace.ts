import '@sky-modules/jsx/global'

import './Box.global'

declare global {
    namespace Design {
        type SlotProps<
            T extends BoxAs = 'div',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            R extends (props: any) => Mitosis.Node = any,
        > = BoxProps<T> &
            Partial<Exclude<Parameters<R>[0], undefined>> & {
                unstyled?: boolean | undefined
                recipe?: R | undefined
            }
    }
}
