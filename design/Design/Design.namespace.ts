import 'sky-jsx/global'

import '../Box/global'

declare global {
    namespace Design {
        type SlotRootProps<
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            R extends (props: any) => any,
            T extends BoxAs = 'div',
        > = BoxProps<T> &
            Partial<Exclude<Parameters<R>[0], undefined>> & {
                unstyled?: true | undefined
                recipe?: R | undefined
            }

        type SlotProps<T extends BoxAs = 'div'> = BoxProps<T>
    }
}
